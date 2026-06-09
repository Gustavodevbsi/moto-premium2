import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

// Rastreia tentativas por IP em memória (suficiente para um único servidor)
const tentativas = new Map<string, { count: number; bloqueadoAte?: number }>();

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  const agora = Date.now();
  const estado = tentativas.get(ip) ?? { count: 0 };

  // Bloqueia IP por 15 min após 10 falhas consecutivas
  if (estado.bloqueadoAte && agora < estado.bloqueadoAte) {
    const restante = Math.ceil((estado.bloqueadoAte - agora) / 1000 / 60);
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${restante} min.` },
      { status: 429 }
    );
  }

  try {
    const { email, senha } = schema.parse(await req.json());

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Sempre executa o bcrypt (mesmo sem usuário) para evitar timing attack
    const senhaFake = "$2b$12$invalidhashtopreventtimingattack0000000000000000000000";
    const ok = admin
      ? await bcrypt.compare(senha, admin.senha)
      : await bcrypt.compare(senha, senhaFake).then(() => false);

    if (!admin || !ok) {
      estado.count = (estado.count ?? 0) + 1;
      if (estado.count >= 10) {
        estado.bloqueadoAte = agora + 15 * 60 * 1000; // 15 min
      }
      tentativas.set(ip, estado);
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // Login bem-sucedido — limpa contador
    tentativas.delete(ip);

    const token = await signToken({ id: admin.id, email: admin.email });
    setAuthCookie(token);

    return NextResponse.json({ ok: true, nome: admin.nome });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

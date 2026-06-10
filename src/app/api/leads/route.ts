import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { createHash } from "crypto";

function hashCpf(cpf: string): string {
  return createHash("sha256").update(cpf.replace(/\D/g, "")).digest("hex");
}

const schema = z.object({
  motoId: z.string().cuid(),
  precoMoto: z.number().positive().max(10_000_000),
  valorEntrada: z.number().min(0).max(10_000_000),
  valorFinanciado: z.number().min(0).max(10_000_000),
  numeroParcelas: z.number().int().min(1).max(72),
  valorParcela: z.number().positive().max(100_000),
  totalPago: z.number().positive().max(20_000_000),
  taxaJuros: z.number().min(0.1).max(10),
  nome: z.string().max(120).optional(),
  cpf: z.string().max(14).optional(),
  telefone: z.string().max(20).optional(),
});

// Rate limit por IP: máx 10 leads por hora
const leadRate = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const agora = Date.now();
  const rl = leadRate.get(ip) ?? { count: 0, resetAt: agora + 3600_000 };
  if (agora > rl.resetAt) { rl.count = 0; rl.resetAt = agora + 3600_000; }
  if (rl.count >= 10) {
    return NextResponse.json({ error: "Limite de simulações atingido. Tente mais tarde." }, { status: 429 });
  }
  rl.count++;
  leadRate.set(ip, rl);

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Verifica se a moto realmente existe
    const motoExiste = await prisma.moto.findUnique({ where: { id: data.motoId }, select: { id: true } });
    if (!motoExiste) return NextResponse.json({ error: "Moto não encontrada" }, { status: 404 });

    const payload = {
      ...data,
      cpf: data.cpf ? hashCpf(data.cpf) : undefined,
    };
    const lead = await prisma.lead.create({ data: payload });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const perPage = 20;
  const status = searchParams.get("status");

  try {
    const VALID_STATUS = ["NOVO", "EM_ATENDIMENTO", "CONVERTIDO", "PERDIDO"] as const;
    type LeadStatus = typeof VALID_STATUS[number];
    const where: { status?: LeadStatus } = {};
    if (status && VALID_STATUS.includes(status as LeadStatus)) {
      where.status = status as LeadStatus;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { moto: { select: { marca: true, modelo: true, ano: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, perPage });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

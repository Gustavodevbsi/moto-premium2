import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  taxaJurosNova: z.number().min(0.01).max(10),
  taxaJurosUsada: z.number().min(0.01).max(10),
  entradaMinima: z.number().min(0).max(80),
  whatsappNumero: z.string().min(10).max(20),
  nomeEmpresa: z.string().min(1),
  corPrimaria: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const data = schema.parse(await req.json());
    let config = await prisma.configuracao.findFirst();

    if (config) {
      config = await prisma.configuracao.update({ where: { id: config.id }, data });
    } else {
      config = await prisma.configuracao.create({ data });
    }

    return NextResponse.json(config);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

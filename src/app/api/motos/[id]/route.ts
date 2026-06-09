import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const updateSchema = z.object({
  marca: z.string().min(1).optional(),
  modelo: z.string().min(1).optional(),
  ano: z.number().int().optional(),
  km: z.number().int().min(0).optional(),
  preco: z.number().positive().optional(),
  descricao: z.string().optional(),
  status: z.enum(["DISPONIVEL", "RESERVADA", "VENDIDA"]).optional(),
  destaque: z.boolean().optional(),
  revisada: z.boolean().optional(),
  garantia: z.boolean().optional(),
  procedencia: z.string().optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const moto = await prisma.moto.findUnique({
    where: { id: params.id },
    include: { fotos: { orderBy: { ordem: "asc" } } },
  });
  if (!moto) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(moto);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);
    const moto = await prisma.moto.update({ where: { id: params.id }, data, include: { fotos: true } });
    return NextResponse.json(moto);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.moto.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

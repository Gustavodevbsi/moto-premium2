import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const schema = z.object({
  marca: z.string().min(1),
  modelo: z.string().min(1),
  ano: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  km: z.number().int().min(0),
  preco: z.number().positive(),
  descricao: z.string().optional(),
  status: z.enum(["DISPONIVEL", "RESERVADA", "VENDIDA"]).default("DISPONIVEL"),
  destaque: z.boolean().default(false),
  revisada: z.boolean().default(false),
  garantia: z.boolean().default(false),
  procedencia: z.string().optional(),
  fotos: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), ordem: z.number().optional() })).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage") || 20)));
  const status = searchParams.get("status");

  const where: any = {};
  if (status) where.status = status;

  const [motos, total] = await Promise.all([
    prisma.moto.findMany({
      where,
      include: { fotos: { orderBy: { ordem: "asc" } } },
      orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.moto.count({ where }),
  ]);

  return NextResponse.json({ motos, total, page, perPage });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { fotos, ...motoData } = schema.parse(body);

    const moto = await prisma.moto.create({
      data: {
        ...motoData,
        fotos: fotos
          ? { create: fotos.map((f, i) => ({ ...f, ordem: f.ordem ?? i })) }
          : undefined,
      },
      include: { fotos: true },
    });

    return NextResponse.json(moto, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

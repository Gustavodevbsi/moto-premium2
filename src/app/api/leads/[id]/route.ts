import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["NOVO", "EM_ATENDIMENTO", "APROVADO", "REPROVADO", "CONVERTIDO"]).optional(),
  observacao: z.string().optional(),
  nome: z.string().optional(),
  telefone: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const data = schema.parse(await req.json());
    const lead = await prisma.lead.update({ where: { id: params.id }, data });
    return NextResponse.json(lead);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let config = await prisma.configuracao.findFirst();
    if (!config) {
      config = await prisma.configuracao.create({
        data: {},
      });
    }
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

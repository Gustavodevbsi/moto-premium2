import { NextResponse } from "next/server";

// Banco Central SGS - séries temporais públicas
// 25467 = Taxa mensal - Aquisição de veículos - Pessoas físicas (novas)
// 25468 = Taxa mensal - Aquisição de veículos - Pessoas físicas (usadas)
const SERIE_NOVA  = 25467;
const SERIE_USADA = 25468;

async function fetchSerie(serie: number): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados/ultimos/1?formato=json`,
      { next: { revalidate: 86400 } } // cache 24h
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0]?.valor ? parseFloat(data[0].valor) : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const [nova, usada] = await Promise.all([
    fetchSerie(SERIE_NOVA),
    fetchSerie(SERIE_USADA),
  ]);

  if (!nova && !usada) {
    return NextResponse.json(
      { error: "Não foi possível buscar as taxas do Banco Central." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    taxaJurosNova:  nova  ?? null,
    taxaJurosUsada: usada ?? null,
    fonte: "Banco Central do Brasil — SGS",
    atualizadoEm: new Date().toLocaleDateString("pt-BR"),
  });
}

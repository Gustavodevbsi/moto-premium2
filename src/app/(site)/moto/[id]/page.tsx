import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Galeria } from "@/components/galeria";
import { Simulador } from "@/components/simulador";
import { formatarMoeda, formatarNumero } from "@/lib/financiamento";
import { isMotoNova, anoAtual } from "@/lib/utils";
import { Calendar, Gauge, CheckCircle2, Share2 } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: { id: string } }

async function getMoto(id: string) {
  const [moto, config] = await Promise.all([
    prisma.moto.findUnique({
      where: { id },
      include: { fotos: { orderBy: { ordem: "asc" } } },
    }),
    prisma.configuracao.findFirst(),
  ]);
  return { moto, config };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moto } = await getMoto(params.id);
  if (!moto) return { title: "Moto não encontrada" };
  return {
    title: `${moto.marca} ${moto.modelo} ${moto.ano}`,
    description: `${moto.marca} ${moto.modelo} ${moto.ano}, ${formatarNumero(moto.km)} km — ${formatarMoeda(moto.preco)}. Simule seu financiamento agora.`,
  };
}

export default async function MotoPage({ params }: Props) {
  const { moto, config } = await getMoto(params.id);
  if (!moto || moto.status === "VENDIDA") notFound();

  const nova = isMotoNova(moto.ano);
  const nomeCompleto = `${moto.marca} ${moto.modelo} ${moto.ano}`;

  const badges = [
    moto.revisada && { label: "Revisada", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    moto.garantia && { label: "Com Garantia", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    nova && { label: "Moto Nova", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
    moto.status === "RESERVADA" && { label: "Reservada", color: "bg-yellow-100 text-yellow-700" },
  ].filter(Boolean) as { label: string; color: string }[];

  return (
    <div className="container py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Home</a>
        {" / "}
        <a href="/estoque" className="hover:text-foreground">Estoque</a>
        {" / "}
        <span className="text-foreground font-medium">{nomeCompleto}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          <Galeria fotos={moto.fotos.map((f) => ({ url: f.url, alt: f.alt ?? undefined }))} modelo={nomeCompleto} />

          {/* Info */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{moto.marca}</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold">{moto.modelo}</h1>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Compartilhar">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b.label} className={`px-3 py-1 rounded-full text-xs font-bold ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Ano</p>
                <div className="flex items-center justify-center gap-1 font-bold">
                  <Calendar className="w-4 h-4 text-primary" />
                  {moto.ano}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Quilometragem</p>
                <div className="flex items-center justify-center gap-1 font-bold">
                  <Gauge className="w-4 h-4 text-primary" />
                  {formatarNumero(moto.km)} km
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Procedência</p>
                <p className="font-bold text-sm">{moto.procedencia || "Nacional"}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Preço</p>
              <p className="text-4xl font-extrabold text-primary">{formatarMoeda(moto.preco)}</p>
            </div>

            {moto.descricao && (
              <div className="pt-2">
                <h3 className="font-semibold mb-2">Sobre esta moto</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{moto.descricao}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                moto.revisada && "✅ Revisada",
                moto.garantia && "🛡️ Garantia incluída",
                "📋 Documentação em dia",
                "💳 IPVA pago",
              ].filter(Boolean).map((item) => (
                <span key={String(item)} className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita: Simulador */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Simulador
            preco={moto.preco}
            modelo={nomeCompleto}
            motoId={moto.id}
            ano={moto.ano}
            taxaNova={config?.taxaJurosNova ?? 1.49}
            taxaUsada={config?.taxaJurosUsada ?? 1.99}
            entradaMinPct={config?.entradaMinima ?? 20}
            whatsapp={config?.whatsappNumero ?? "5581995473370"}
          />
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { MotoIcon } from "@/components/icons/moto-icon";
import { MotoCard } from "@/components/moto-card";
import { Simulador } from "@/components/simulador";
import { HeroSection } from "@/components/hero-section";
import { DestaquesBanner } from "@/components/destaques-banner";
import { Depoimentos } from "@/components/depoimentos";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDados() {
  const [motos, config] = await Promise.all([
    prisma.moto.findMany({
      where: { status: "DISPONIVEL", destaque: true },
      include: { fotos: { orderBy: { ordem: "asc" }, take: 1 } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.configuracao.findFirst(),
  ]);
  return { motos, config };
}

export default async function HomePage() {
  const { motos, config } = await getDados();

  return (
    <>
      <HeroSection />
      <DestaquesBanner />

      {/* Motos em Destaque */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Selecionadas para você</p>
            <h2 className="text-3xl font-extrabold">Motos em Destaque</h2>
          </div>
          <Link href="/estoque" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {motos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MotoIcon className="w-14 h-11 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
            <p className="font-semibold">Nenhuma moto em destaque no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {motos.map((m) => (
              <MotoCard
                key={m.id}
                id={m.id}
                marca={m.marca}
                modelo={m.modelo}
                ano={m.ano}
                km={m.km}
                preco={m.preco}
                foto={m.fotos[0]?.url}
                destaque={m.destaque}
              />
            ))}
          </div>
        )}
      </section>

      {/* Simulador rÃ¡pido */}
      <section id="simulador" className="bg-muted/50 py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Sem sair de casa</p>
            <h2 className="text-3xl font-extrabold">Simule Seu Financiamento</h2>
            <p className="text-muted-foreground mt-2">Descubra em segundos qual o valor da sua parcela.</p>
          </div>
          <SimuladorRapido config={config} />
        </div>
      </section>

      <Depoimentos />
    </>
  );
}

function SimuladorRapido({ config }: { config: any }) {
  const precos = [8000, 12000, 18000, 25000, 35000];
  return (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Escolha um valor de referência ou acesse uma moto para simular o valor exato:
      </p>
      <div className="grid grid-cols-5 gap-2">
        {precos.map((p) => (
          <Link
            key={p}
            href={`/estoque?preco_max=${p}`}
            className="text-center py-3 rounded-xl border text-xs font-bold hover:border-primary hover:text-primary transition-all"
          >
            Até<br />R${(p / 1000).toFixed(0)}k
          </Link>
        ))}
      </div>
      <Link
        href="/estoque"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl gradient-brand text-white font-bold hover:opacity-90 transition-opacity"
      >
        Ver Estoque Completo <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}


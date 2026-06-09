import { prisma } from "@/lib/prisma";
import { MotoCard } from "@/components/moto-card";
import { FiltrosEstoque } from "@/components/filtros-estoque";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estoque de Motos",
  description: "Confira nossas motos disponíveis com financiamento facilitado.",
};

export const revalidate = 30;

interface SearchParams {
  marca?: string;
  modelo?: string;
  ano_min?: string;
  ano_max?: string;
  preco_min?: string;
  preco_max?: string;
  km_max?: string;
  page?: string;
}

async function getMotos(params: SearchParams) {
  const where: any = { status: "DISPONIVEL" };

  if (params.marca) where.marca = { contains: params.marca };
  if (params.modelo) where.modelo = { contains: params.modelo };
  if (params.ano_min || params.ano_max) {
    where.ano = {};
    if (params.ano_min) where.ano.gte = Number(params.ano_min);
    if (params.ano_max) where.ano.lte = Number(params.ano_max);
  }
  if (params.preco_min || params.preco_max) {
    where.preco = {};
    if (params.preco_min) where.preco.gte = Number(params.preco_min);
    if (params.preco_max) where.preco.lte = Number(params.preco_max);
  }
  if (params.km_max) where.km = { lte: Number(params.km_max) };

  const page = Number(params.page || 1);
  const perPage = 12;

  const [motos, total] = await Promise.all([
    prisma.moto.findMany({
      where,
      include: { fotos: { orderBy: { ordem: "asc" }, take: 1 } },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: [{ destaque: "desc" }, { createdAt: "desc" }],
    }),
    prisma.moto.count({ where }),
  ]);

  const marcas = await prisma.moto.groupBy({
    by: ["marca"],
    where: { status: "DISPONIVEL" },
    orderBy: { marca: "asc" },
  });

  return { motos, total, page, perPage, marcas: marcas.map((m) => m.marca) };
}

export default async function EstoquePage({ searchParams }: { searchParams: SearchParams }) {
  const { motos, total, page, perPage, marcas } = await getMotos(searchParams);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Estoque de Motos</h1>
        <p className="text-muted-foreground mt-1">{total} moto{total !== 1 ? "s" : ""} disponíve{total !== 1 ? "is" : "l"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside>
          <FiltrosEstoque marcas={marcas} current={searchParams} />
        </aside>

        <div className="space-y-6">
          {motos.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-lg font-semibold">Nenhuma moto encontrada</p>
              <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                    p === page ? "gradient-orange text-white" : "border hover:border-primary"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { formatarMoeda } from "@/lib/financiamento";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { ClearLeadsButton } from "@/components/admin/clear-leads-button";

export const dynamic = "force-dynamic";

const STATUSES = ["", "NOVO", "EM_ATENDIMENTO", "APROVADO", "REPROVADO", "CONVERTIDO"];

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string; [key: string]: string | undefined };
}) {
  const page = Number(searchParams.page || 1);
  const perPage = 20;
  const where: { status?: string } = {};
  if (searchParams.status) where.status = searchParams.status;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Leads</h1>
          <p className="text-muted-foreground">{total} lead{total !== 1 ? "s" : ""} capturado{total !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <ClearLeadsButton />
          {STATUSES.map((s) => (
            <a
              key={s}
              href={s ? `?status=${s}` : "?"}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                searchParams.status === s || (!s && !searchParams.status)
                  ? "gradient-brand text-white border-transparent"
                  : "hover:border-primary"
              }`}
            >
              {s || "Todos"}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">Moto</th>
                <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Simulacao</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Data</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lead.moto.marca} {lead.moto.modelo}</p>
                    <p className="text-xs text-muted-foreground">{lead.moto.ano} &middot; {formatarMoeda(lead.precoMoto)}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="font-medium">{lead.numeroParcelas}x {formatarMoeda(lead.valorParcela)}</p>
                    <p className="text-xs text-muted-foreground">Entrada: {formatarMoeda(lead.valorEntrada)}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-5xl mb-3">&#x1F4CB;</p>
              <p>Nenhum lead encontrado</p>
            </div>
          )}
        </div>
      </div>

      {Math.ceil(total / perPage) > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: Math.ceil(total / perPage) }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                p === page ? "gradient-brand text-white" : "border hover:border-primary"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

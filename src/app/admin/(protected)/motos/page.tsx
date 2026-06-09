import { prisma } from "@/lib/prisma";
import { formatarMoeda, formatarNumero } from "@/lib/financiamento";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";
import { DeleteMotoButton } from "@/components/admin/delete-moto-button";
import { StatusBadge } from "@/components/admin/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminMotosPage() {
  const motos = await prisma.moto.findMany({
    include: { fotos: { take: 1, orderBy: { ordem: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Motos</h1>
          <p className="text-muted-foreground">{motos.length} moto{motos.length !== 1 ? "s" : ""} cadastrada{motos.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/motos/nova"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-orange text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Moto
        </Link>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold">Moto</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Ano/KM</th>
                <th className="text-left px-4 py-3 font-semibold">Preço</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {motos.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {m.fotos[0] ? (
                          <img src={m.fotos[0].url} alt={m.modelo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <MotoIcon className="w-7 h-5 text-muted-foreground/30" strokeWidth={1.2} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{m.marca}</p>
                        <p className="text-muted-foreground text-xs">{m.modelo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {m.ano} · {formatarNumero(m.km)} km
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">{formatarMoeda(m.preco)}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/moto/${m.id}`} target="_blank" className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Ver no site">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/motos/${m.id}`} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteMotoButton id={m.id} nome={`${m.marca} ${m.modelo}`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {motos.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <MotoIcon className="w-14 h-11 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
              <p className="font-semibold">Nenhuma moto cadastrada</p>
              <Link href="/admin/motos/nova" className="text-primary hover:underline text-sm mt-2 inline-block">
                Cadastrar primeira moto →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

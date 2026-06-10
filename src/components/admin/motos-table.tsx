"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Eye, Trash2 } from "lucide-react";
import { formatarMoeda, formatarNumero } from "@/lib/financiamento";
import { MotoIcon } from "@/components/icons/moto-icon";
import { DeleteMotoButton } from "@/components/admin/delete-moto-button";
import { StatusBadge } from "@/components/admin/status-badge";

interface Moto {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  preco: number;
  status: string;
  fotos: { url: string }[];
}

export function MotosTable({ motos }: { motos: Moto[] }) {
  const router = useRouter();
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [deletandoVarios, setDeletandoVarios] = useState(false);

  const todos = selecionados.size === motos.length && motos.length > 0;
  const algum = selecionados.size > 0;

  function toggleTodos() {
    setSelecionados(todos ? new Set() : new Set(motos.map((m) => m.id)));
  }

  function toggle(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function excluirSelecionados() {
    if (!confirm(`Excluir ${selecionados.size} moto${selecionados.size > 1 ? "s" : ""}? Esta ação é irreversível.`)) return;
    setDeletandoVarios(true);
    try {
      const res = await fetch("/api/motos/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selecionados) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erro ao excluir. Tente novamente.");
        return;
      }
      setSelecionados(new Set());
      router.refresh();
    } catch {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setDeletandoVarios(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Motos</h1>
          <p className="text-muted-foreground">
            {motos.length} moto{motos.length !== 1 ? "s" : ""} cadastrada{motos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {algum && (
            <button
              onClick={excluirSelecionados}
              disabled={deletandoVarios}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Excluir {selecionados.size} selecionada{selecionados.size > 1 ? "s" : ""}
            </button>
          )}
          <Link
            href="/admin/motos/nova"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nova Moto
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={todos}
                    onChange={toggleTodos}
                    className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 font-semibold">Moto</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Ano/KM</th>
                <th className="text-left px-4 py-3 font-semibold">Preço</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {motos.map((m) => (
                <tr
                  key={m.id}
                  className={`transition-colors ${selecionados.has(m.id) ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-muted/30"}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selecionados.has(m.id)}
                      onChange={() => toggle(m.id)}
                      className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {m.fotos[0] ? (
                          <img src={m.fotos[0].url} alt={m.modelo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
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

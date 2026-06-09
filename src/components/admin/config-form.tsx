"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Percent, Phone, Building2 } from "lucide-react";

interface ConfigFormProps {
  initial: {
    id: string;
    taxaJurosNova: number;
    taxaJurosUsada: number;
    entradaMinima: number;
    whatsappNumero: string;
    nomeEmpresa: string;
    corPrimaria: string;
  };
}

export function ConfigForm({ initial }: ConfigFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(false);

    await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOk(true);
    router.refresh();
    setLoading(false);
  }

  const group = (titulo: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="rounded-2xl border bg-card p-6 space-y-4">
      <h3 className="font-bold flex items-center gap-2 border-b pb-3">
        {icon} {titulo}
      </h3>
      {children}
    </div>
  );

  const field = (label: string, hint: string, children: React.ReactNode) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {ok && (
        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm dark:bg-green-900/20 dark:border-green-700/30 dark:text-green-400">
          ✅ Configurações salvas com sucesso!
        </div>
      )}

      {group(
        "Taxas de Financiamento",
        <Percent className="w-4 h-4 text-primary" />,
        <>
          {field(
            "Taxa para Motos Novas (% ao mês)",
            `Aplicada para motos do ano ${new Date().getFullYear()} em diante`,
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="10"
                value={form.taxaJurosNova}
                onChange={(e) => update("taxaJurosNova", Number(e.target.value))}
                className="w-full px-3 py-2.5 pr-8 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">%</span>
            </div>
          )}
          {field(
            "Taxa para Motos Usadas (% ao mês)",
            "Aplicada para motos de anos anteriores",
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="10"
                value={form.taxaJurosUsada}
                onChange={(e) => update("taxaJurosUsada", Number(e.target.value))}
                className="w-full px-3 py-2.5 pr-8 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">%</span>
            </div>
          )}
          {field(
            "Entrada Mínima (%)",
            "Percentual mínimo da entrada em relação ao valor da moto",
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="80"
                value={form.entradaMinima}
                onChange={(e) => update("entradaMinima", Number(e.target.value))}
                className="w-full px-3 py-2.5 pr-8 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">%</span>
            </div>
          )}
        </>
      )}

      {group(
        "WhatsApp e Contato",
        <Phone className="w-4 h-4 text-primary" />,
        field(
          "Número do WhatsApp",
          "Formato internacional sem espaços ou símbolos: 5511999999999",
          <input
            type="text"
            value={form.whatsappNumero}
            onChange={(e) => update("whatsappNumero", e.target.value)}
            placeholder="5511999999999"
            className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )
      )}

      {group(
        "Identidade da Empresa",
        <Building2 className="w-4 h-4 text-primary" />,
        field(
          "Nome da Empresa",
          "Aparece no rodapé e nas comunicações",
          <input
            type="text"
            value={form.nomeEmpresa}
            onChange={(e) => update("nomeEmpresa", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-orange text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {loading ? "Salvando..." : "Salvar Configurações"}
      </button>
    </form>
  );
}

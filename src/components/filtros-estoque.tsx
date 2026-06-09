"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface FiltrosProps {
  marcas: string[];
  current: Record<string, string | undefined>;
}

export function FiltrosEstoque({ marcas, current }: FiltrosProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  const [filtros, setFiltros] = useState({
    marca: current.marca || "",
    modelo: current.modelo || "",
    ano_min: current.ano_min || "",
    ano_max: current.ano_max || "",
    preco_min: current.preco_min || "",
    preco_max: current.preco_max || "",
    km_max: current.km_max || "",
  });

  const aplicar = () => {
    const p = new URLSearchParams();
    Object.entries(filtros).forEach(([k, v]) => v && p.set(k, v));
    router.push(`${pathname}?${p.toString()}`);
    setAberto(false);
  };

  const limpar = () => {
    setFiltros({ marca: "", modelo: "", ano_min: "", ano_max: "", preco_min: "", preco_max: "", km_max: "" });
    router.push(pathname);
  };

  const temFiltros = Object.values(filtros).some(Boolean);

  const inner = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
        </h3>
        {temFiltros && (
          <button onClick={limpar} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marca</label>
        <select
          value={filtros.marca}
          onChange={(e) => setFiltros((p) => ({ ...p, marca: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
        >
          <option value="">Todas as marcas</option>
          {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modelo</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={filtros.modelo}
            onChange={(e) => setFiltros((p) => ({ ...p, modelo: e.target.value }))}
            placeholder="Ex: CB 500, MT-07..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border bg-background text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ano</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="De" value={filtros.ano_min} onChange={(e) => setFiltros((p) => ({ ...p, ano_min: e.target.value }))} className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input type="number" placeholder="Até" value={filtros.ano_max} onChange={(e) => setFiltros((p) => ({ ...p, ano_max: e.target.value }))} className="px-3 py-2 rounded-lg border bg-background text-sm" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preço (R$)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Mín" value={filtros.preco_min} onChange={(e) => setFiltros((p) => ({ ...p, preco_min: e.target.value }))} className="px-3 py-2 rounded-lg border bg-background text-sm" />
          <input type="number" placeholder="Máx" value={filtros.preco_max} onChange={(e) => setFiltros((p) => ({ ...p, preco_max: e.target.value }))} className="px-3 py-2 rounded-lg border bg-background text-sm" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">KM máximo</label>
        <input type="number" placeholder="Ex: 50000" value={filtros.km_max} onChange={(e) => setFiltros((p) => ({ ...p, km_max: e.target.value }))} className="w-full px-3 py-2 rounded-lg border bg-background text-sm" />
      </div>

      <button onClick={aplicar} className="w-full py-2.5 rounded-xl gradient-orange text-white font-bold text-sm hover:opacity-90 transition-opacity">
        Aplicar Filtros
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block sticky top-24 rounded-2xl border bg-card p-5">
        {inner}
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setAberto(!aberto)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-card text-sm font-semibold w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros {temFiltros && <span className="w-2 h-2 rounded-full bg-primary" />}
        </button>
        {aberto && (
          <div className="mt-3 rounded-2xl border bg-card p-5">
            {inner}
          </div>
        )}
      </div>
    </>
  );
}

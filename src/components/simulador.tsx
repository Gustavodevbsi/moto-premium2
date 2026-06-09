"use client";

import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { calcularTabelaPrice, formatarMoeda, gerarMensagemWhatsApp } from "@/lib/financiamento";
import { isMotoNova } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { TrendingUp, ArrowRight, Info } from "lucide-react";

interface SimuladorProps {
  preco: number;
  modelo: string;
  motoId?: string;
  ano: number;
  taxaNova?: number;
  taxaUsada?: number;
  entradaMinPct?: number;
  whatsapp?: string;
  compact?: boolean;
}

const PARCELAS_OPTS = [12, 24, 36, 48, 60];
const ENTRADA_ATALHOS = [10, 20, 30, 40, 50];

export function Simulador({
  preco,
  modelo,
  motoId,
  ano,
  taxaNova = 1.49,
  taxaUsada = 1.99,
  entradaMinPct = 20,
  whatsapp = "5511999999999",
  compact = false,
}: SimuladorProps) {
  const nova = isMotoNova(ano);
  const taxa = nova ? taxaNova : taxaUsada;
  const entradaMin = (entradaMinPct / 100) * preco;

  const [entrada, setEntrada] = useState(Math.round(entradaMin));
  const [parcelas, setParcelas] = useState(36);
  const [inputEntrada, setInputEntrada] = useState(String(Math.round(entradaMin)));

  const resultado = calcularTabelaPrice({ preco, entrada, parcelas, taxaMensal: taxa });
  const entradaPct = Math.round((entrada / preco) * 100);
  const valida = entrada >= entradaMin;

  const atalho = (pct: number) => {
    const v = Math.round((pct / 100) * preco);
    setEntrada(v);
    setInputEntrada(String(v));
  };

  const linkWpp = `https://wa.me/${whatsapp}?text=${gerarMensagemWhatsApp(
    modelo, preco, entrada, parcelas, resultado.valorParcela
  )}`;

  const salvarLead = useCallback(async () => {
    if (!motoId || !valida) return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motoId, precoMoto: preco, valorEntrada: entrada,
          valorFinanciado: resultado.valorFinanciado,
          numeroParcelas: parcelas, valorParcela: resultado.valorParcela,
          totalPago: resultado.totalPago, taxaJuros: taxa,
        }),
      });
    } catch {}
  }, [motoId, preco, entrada, parcelas, resultado, taxa, valida]);

  if (compact) {
    return (
      <div className="rounded-2xl border bg-card p-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Simule as parcelas</p>
        <div className="flex gap-2 flex-wrap">
          {PARCELAS_OPTS.map((p) => (
            <button
              key={p}
              onClick={() => setParcelas(p)}
              className={cn(
                "flex-1 min-w-[52px] py-2 rounded-xl text-sm font-bold border transition-all",
                parcelas === p ? "gradient-brand text-white border-transparent shadow-brand-sm" : "hover:border-indigo-400 hover:text-indigo-600"
              )}
            >
              {p}x
            </button>
          ))}
        </div>
        <div className="rounded-xl gradient-brand p-4 text-white text-center shadow-brand">
          <p className="text-xs opacity-70 mb-1">A partir de</p>
          <p className="text-3xl font-display font-extrabold">{formatarMoeda(resultado.valorParcela)}</p>
          <p className="text-xs opacity-70 mt-1">por mês · taxa {taxa}% a.m.</p>
        </div>
        <a
          href={linkWpp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors"
        >
          💬 Quero este financiamento
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
      {/* Header */}
      <div className="gradient-dark px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h2 className="font-display font-bold text-white">Simulador de Financiamento</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {nova ? "Moto nova" : "Moto usada"} · Tabela Price · {taxa}% a.m.
          </p>
        </div>
        <span className={cn(
          "text-xs font-bold px-2.5 py-1 rounded-lg",
          nova ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-500/20 text-slate-400"
        )}>
          {nova ? "Nova" : "Usada"}
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* Entrada */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Valor de Entrada</label>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-md",
              valida ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                     : "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
            )}>
              {entradaPct}% do valor
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">R$</span>
            <input
              type="number"
              value={inputEntrada}
              onChange={(e) => {
                setInputEntrada(e.target.value);
                const v = Number(e.target.value);
                if (!isNaN(v)) setEntrada(Math.min(v, preco * 0.9));
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-shadow"
            />
          </div>

          <Slider
            value={[entrada]}
            min={0}
            max={preco * 0.9}
            step={500}
            onValueChange={([v]) => { setEntrada(v); setInputEntrada(String(v)); }}
          />

          <div className="grid grid-cols-5 gap-1.5">
            {ENTRADA_ATALHOS.map((pct) => (
              <button
                key={pct}
                onClick={() => atalho(pct)}
                className={cn(
                  "py-1.5 rounded-lg text-xs font-bold border transition-all",
                  entradaPct === pct
                    ? "gradient-brand text-white border-transparent"
                    : "hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500"
                )}
              >
                {pct}%
              </button>
            ))}
          </div>

          {!valida && (
            <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Entrada mínima: {formatarMoeda(entradaMin)} ({entradaMinPct}%)
            </div>
          )}
        </div>

        {/* Parcelas */}
        <div className="space-y-3">
          <label className="text-sm font-semibold">Parcelamento</label>
          <div className="grid grid-cols-5 gap-2">
            {PARCELAS_OPTS.map((p) => (
              <button
                key={p}
                onClick={() => setParcelas(p)}
                className={cn(
                  "py-3 rounded-xl text-sm font-bold border transition-all",
                  parcelas === p
                    ? "gradient-brand text-white border-transparent shadow-brand-sm scale-105"
                    : "hover:border-indigo-400 hover:text-indigo-600"
                )}
              >
                {p}×
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className={cn(
          "rounded-2xl p-5 space-y-4 transition-all",
          valida ? "gradient-dark" : "bg-muted"
        )}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { l: "Financiado",    v: resultado.valorFinanciado },
              { l: "Juros totais",  v: resultado.totalJuros },
              { l: "Total pago",    v: resultado.totalPago },
              { l: "CET anual",     v: null, txt: `${resultado.cet.toFixed(2)}% a.a.` },
            ].map(({ l, v, txt }) => (
              <div key={l}>
                <p className={cn("text-xs", valida ? "text-slate-500" : "text-muted-foreground")}>{l}</p>
                <p className={cn("font-bold text-sm mt-0.5", valida ? "text-white" : "")}>
                  {txt ?? formatarMoeda(v!)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className={cn("text-xs mb-1", valida ? "text-slate-500" : "text-muted-foreground")}>
              Valor da parcela mensal
            </p>
            <div className="flex items-end gap-2">
              <span className={cn(
                "text-4xl font-display font-extrabold",
                valida ? "text-gradient" : "text-muted-foreground"
              )}>
                {formatarMoeda(resultado.valorParcela)}
              </span>
              <span className={cn("text-sm mb-0.5", valida ? "text-slate-500" : "text-muted-foreground")}>
                / mês
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href={valida ? linkWpp : "#"}
          target={valida ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={valida ? salvarLead : undefined}
          className={cn(
            "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold transition-all",
            valida
              ? "gradient-brand text-white hover:opacity-90 hover:shadow-brand-lg hover:scale-[1.02] active:scale-[0.99]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          🚀 Gostei, quero aprovar meu crédito
          <ArrowRight className="w-4 h-4" />
        </a>

        <p className="text-[11px] text-center text-muted-foreground">
          Simulação informativa. Taxa final sujeita a análise de crédito.
        </p>
      </div>
    </div>
  );
}

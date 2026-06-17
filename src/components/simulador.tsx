"use client";

import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  calcularTabelaPrice, formatarMoeda,
  gerarMensagemFinanciamento, gerarMensagemCartao, gerarMensagemAVista,
  validarCPF, mascararCPF,
} from "@/lib/financiamento";
import { isMotoNova, cn } from "@/lib/utils";
import { TrendingUp, ArrowRight, Info, User, CreditCard, CheckCircle2, Banknote, BadgeDollarSign } from "lucide-react";
import Link from "next/link";

type Modalidade = "financiamento" | "cartao" | "avista";

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
const PARCELAS_CARTAO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const MODALIDADES: { id: Modalidade; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "financiamento", label: "Financiamento", icon: <TrendingUp className="w-4 h-4" />, desc: "Tabela Price com entrada" },
  { id: "cartao",        label: "Cartão",        icon: <CreditCard className="w-4 h-4" />, desc: "Crédito parcelado" },
  { id: "avista",        label: "À Vista",        icon: <Banknote className="w-4 h-4" />,  desc: "Pagamento imediato" },
];

export function Simulador({
  preco,
  modelo,
  motoId,
  ano,
  taxaNova = 1.49,
  taxaUsada = 1.99,
  entradaMinPct = 20,
  whatsapp = "5581995473370",
  compact = false,
}: SimuladorProps) {
  const nova = isMotoNova(ano);
  const taxa = nova ? taxaNova : taxaUsada;
  const entradaMin = (entradaMinPct / 100) * preco;

  const [modalidade, setModalidade] = useState<Modalidade>("financiamento");
  const [entrada, setEntrada] = useState(Math.round(entradaMin));
  const [parcelas, setParcelas] = useState(36);
  const [parcelasCartao, setParcelasCartao] = useState(12);
  const [inputEntrada, setInputEntrada] = useState(String(Math.round(entradaMin)));

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cpfTocado, setCpfTocado] = useState(false);
  const [consentiu, setConsentiu] = useState(false);

  const resultado = calcularTabelaPrice({ preco, entrada, parcelas, taxaMensal: taxa });
  const entradaPct = Math.round((entrada / preco) * 100);
  const entradaValida = entrada >= entradaMin;
  const cpfValido = validarCPF(cpf);
  const nomeValido = nome.trim().split(" ").length >= 2;

  const podeEnviar =
    modalidade === "financiamento" ? entradaValida && cpfValido && nomeValido && consentiu :
    modalidade === "cartao"        ? nomeValido && consentiu :
    nomeValido && consentiu;

  const atalho = (pct: number) => {
    const v = Math.round((pct / 100) * preco);
    setEntrada(v);
    setInputEntrada(String(v));
  };

  const linkWpp = (() => {
    const base = `https://wa.me/${whatsapp}?text=`;
    if (modalidade === "financiamento")
      return base + gerarMensagemFinanciamento(modelo, preco, entrada, parcelas, resultado.valorParcela, nome.trim(), cpf);
    if (modalidade === "cartao")
      return base + gerarMensagemCartao(modelo, preco, parcelasCartao, nome.trim());
    return base + gerarMensagemAVista(modelo, preco, nome.trim());
  })();

  const salvarLead = useCallback(async () => {
    if (!motoId || !podeEnviar || modalidade !== "financiamento") return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motoId, precoMoto: preco, valorEntrada: entrada,
          valorFinanciado: resultado.valorFinanciado,
          numeroParcelas: parcelas, valorParcela: resultado.valorParcela,
          totalPago: resultado.totalPago, taxaJuros: taxa,
          nome: nome.trim(), cpf,
        }),
      });
    } catch {}
  }, [motoId, preco, entrada, parcelas, resultado, taxa, nome, cpf, podeEnviar, modalidade]);

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
      <div className="gradient-dark px-6 py-5">
        <div className="flex items-center gap-2">
          <BadgeDollarSign className="w-4 h-4 text-indigo-400" />
          <h2 className="font-display font-bold text-white">Como você quer pagar?</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Escolha a modalidade e simule</p>
      </div>

      <div className="p-5 space-y-5">

        {/* Seletor de modalidade */}
        <div className="grid grid-cols-3 gap-2">
          {MODALIDADES.map(({ id, label, icon, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setModalidade(id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all",
                modalidade === id
                  ? "gradient-brand text-white border-transparent shadow-brand-sm scale-[1.02]"
                  : "hover:border-indigo-400 hover:text-indigo-600 text-muted-foreground"
              )}
            >
              {icon}
              <span className="text-xs font-bold leading-none">{label}</span>
              <span className={cn("text-[10px] leading-none", modalidade === id ? "opacity-70" : "text-muted-foreground/70")}>
                {desc}
              </span>
            </button>
          ))}
        </div>

        {/* ── FINANCIAMENTO ── */}
        {modalidade === "financiamento" && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Valor de Entrada</label>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-md",
                  entradaValida
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
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

              {!entradaValida && (
                <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Entrada mínima: {formatarMoeda(entradaMin)} ({entradaMinPct}%)
                </div>
              )}
            </div>

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

            <div className={cn(
              "rounded-2xl p-5 space-y-4 transition-all",
              entradaValida ? "gradient-dark" : "bg-muted"
            )}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { l: "Financiado",   v: resultado.valorFinanciado },
                  { l: "Juros totais", v: resultado.totalJuros },
                  { l: "Total pago",   v: resultado.totalPago },
                  { l: "CET anual",    v: null, txt: `${resultado.cet.toFixed(2)}% a.a.` },
                ].map(({ l, v, txt }) => (
                  <div key={l}>
                    <p className={cn("text-xs", entradaValida ? "text-slate-500" : "text-muted-foreground")}>{l}</p>
                    <p className={cn("font-bold text-sm mt-0.5", entradaValida ? "text-white" : "")}>
                      {txt ?? formatarMoeda(v!)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className={cn("text-xs mb-1", entradaValida ? "text-slate-500" : "text-muted-foreground")}>
                  Valor da parcela mensal
                </p>
                <div className="flex items-end gap-2">
                  <span className={cn(
                    "text-4xl font-display font-extrabold",
                    entradaValida ? "text-gradient" : "text-muted-foreground"
                  )}>
                    {formatarMoeda(resultado.valorParcela)}
                  </span>
                  <span className={cn("text-sm mb-0.5", entradaValida ? "text-slate-500" : "text-muted-foreground")}>
                    / mês
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── CARTÃO ── */}
        {modalidade === "cartao" && (
          <div className="space-y-4">
            <div className="rounded-2xl gradient-dark p-5 text-center space-y-1">
              <p className="text-xs text-slate-500">Valor total</p>
              <p className="text-4xl font-display font-extrabold text-gradient">{formatarMoeda(preco)}</p>
              <p className="text-xs text-slate-500">sujeito a juros da operadora do cartão</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Quantas parcelas no cartão?</label>
              <select
                value={parcelasCartao}
                onChange={(e) => setParcelasCartao(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border bg-background text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-shadow"
              >
                {PARCELAS_CARTAO.map((p) => (
                  <option key={p} value={p}>{p === 1 ? "À vista no cartão" : `${p}× parcelas`}</option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-2.5 rounded-lg">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              O valor das parcelas pode variar conforme a taxa da maquineta e a bandeira do cartão. O valor final é confirmado no momento do pagamento.
            </div>
          </div>
        )}

        {/* ── À VISTA ── */}
        {modalidade === "avista" && (
          <div className="space-y-4">
            <div className="rounded-2xl gradient-dark p-5 text-center space-y-2">
              <p className="text-xs text-slate-500">Valor anunciado</p>
              <p className="text-4xl font-display font-extrabold text-gradient">{formatarMoeda(preco)}</p>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                💵 Pagamento à vista — negocie desconto!
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted px-3 py-2.5 rounded-lg">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              Pagamentos à vista podem ter condições especiais. Converse com o vendedor.
            </div>
          </div>
        )}

        {/* Dados do cliente */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2">
              Seus dados
            </p>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              className={cn(
                "w-full pl-10 pr-10 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all",
                nome.length > 0 && !nomeValido && "border-red-300 focus:ring-red-300/50"
              )}
            />
            {nomeValido && (
              <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
            )}
          </div>
          {nome.length > 0 && !nomeValido && (
            <p className="text-xs text-red-500 -mt-1.5 pl-1">Digite o nome e sobrenome</p>
          )}

          {/* CPF só é obrigatório no financiamento */}
          {modalidade === "financiamento" && (
            <>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(mascararCPF(e.target.value))}
                  onBlur={() => setCpfTocado(true)}
                  placeholder="CPF: 000.000.000-00"
                  maxLength={14}
                  className={cn(
                    "w-full pl-10 pr-10 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all font-mono tracking-wide",
                    cpfTocado && cpf.length > 0 && !cpfValido && "border-red-300 focus:ring-red-300/50"
                  )}
                />
                {cpfValido && (
                  <CheckCircle2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                )}
              </div>
              {cpfTocado && cpf.length > 0 && !cpfValido && (
                <p className="text-xs text-red-500 -mt-1.5 pl-1">CPF inválido</p>
              )}
            </>
          )}

          <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            {modalidade === "financiamento"
              ? "Seus dados são usados apenas para análise de crédito e não são compartilhados."
              : "Seu nome ajuda o vendedor a te identificar na conversa."}
          </p>

          {/* Consentimento LGPD */}
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={consentiu}
              onChange={(e) => setConsentiu(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border accent-indigo-500 cursor-pointer shrink-0"
            />
            <span className="text-[11px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
              Autorizo o uso dos meus dados para contato comercial conforme a{" "}
              <Link href="/privacidade" target="_blank" className="text-indigo-500 underline underline-offset-2 hover:text-indigo-400">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
        </div>

        {/* CTA */}
        <a
          href={podeEnviar ? linkWpp : "#"}
          target={podeEnviar ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={podeEnviar ? salvarLead : undefined}
          className={cn(
            "flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold transition-all",
            podeEnviar
              ? "gradient-brand text-white hover:opacity-90 hover:shadow-brand-lg hover:scale-[1.02] active:scale-[0.99]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {modalidade === "financiamento" && "🚀 Quero aprovar meu crédito"}
          {modalidade === "cartao"        && "💳 Quero parcelar no cartão"}
          {modalidade === "avista"        && "💵 Quero comprar à vista"}
          <ArrowRight className="w-4 h-4" />
        </a>

        {!podeEnviar && (
          <p className="text-[11px] text-center text-muted-foreground -mt-2">
            {!nomeValido
              ? "Digite seu nome completo para continuar"
              : modalidade === "financiamento" && !entradaValida
              ? `Defina uma entrada mínima de ${entradaMinPct}%`
              : modalidade === "financiamento" && !cpfValido
              ? "Digite seu CPF para continuar"
              : ""}
          </p>
        )}

        <p className="text-[11px] text-center text-muted-foreground">
          {modalidade === "financiamento"
            ? "Simulação informativa. Taxa final sujeita a análise de crédito."
            : "Condições sujeitas a confirmação com o vendedor."}
        </p>
      </div>
    </div>
  );
}

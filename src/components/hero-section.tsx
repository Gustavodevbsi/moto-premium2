import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";

export function HeroSection() {
  return (
    <section className="relative min-h-[96vh] flex items-center overflow-hidden gradient-dark">

      {/* Orbs de luz atmosféricos */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Linha decorativa horizontal */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="container relative z-10 py-32 grid lg:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-indigo-200 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Aprovação em até 24h · Parcelas a partir de R$&nbsp;349
          </div>

          <div className="space-y-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05]">
              Sua próxima
              <br />
              moto começa
              <br />
              <span className="text-gradient">aqui.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed">
              Simule seu financiamento em segundos, compare parcelas e fale
              direto com nosso time. Rápido, transparente, sem burocracia.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link
              href="/estoque"
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm glow-purple hover:opacity-90 transition-all"
            >
              Ver estoque
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/#simulador"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl glass text-white font-semibold text-sm hover:bg-white/10 transition-all border border-white/10"
            >
              Simular agora
            </Link>
          </div>

          {/* Stats inline */}
          <div
            className="flex gap-8 pt-4 border-t border-white/8 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { n: "500+",  l: "Motos vendidas" },
              { n: "98%",   l: "Aprovação de crédito" },
              { n: "60x",   l: "Máximo de parcelas" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-display font-bold text-white">{s.n}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Card flutuante — destaque visual */}
        <div className="hidden lg:flex justify-center items-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative w-full max-w-sm animate-float">
            {/* Card principal */}
            <div className="glass rounded-3xl p-6 space-y-5 glow-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Simulação</p>
                  <p className="text-white font-display font-bold text-lg mt-0.5">Honda CB 500F 2024</p>
                </div>
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                  <MotoIcon className="w-6 h-5 text-white" strokeWidth={1.6} />
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Valor do bem</span>
                  <span className="text-white font-semibold">R$ 32.990</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Entrada (20%)</span>
                  <span className="text-white font-semibold">R$ 6.598</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Financiado</span>
                  <span className="text-white font-semibold">R$ 26.392</span>
                </div>
                <div className="h-px bg-white/10 my-1" />
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">36x de</span>
                  <span className="text-2xl font-display font-bold text-gradient">R$ 967</span>
                </div>
              </div>

              {/* Mini progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Taxa 1,49% a.m.</span>
                  <span>CET 19,4% a.a.</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[62%] rounded-full gradient-brand" />
                </div>
              </div>

              <button className="w-full py-3 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Aprovar meu crédito →
              </button>
            </div>

            {/* Badge flutuante */}
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-3 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-medium">Crédito aprovado!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1080 60 360 0 0 20L0 60Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}

import { BadgeCheck, Wrench, CreditCard, HeadphonesIcon } from "lucide-react";

const itens = [
  {
    icon: BadgeCheck,
    titulo: "Aprovação em 24h",
    desc: "Análise de crédito rápida sem burocracia",
    cor: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
  },
  {
    icon: Wrench,
    titulo: "Motos revisadas",
    desc: "100% inspecionadas por mecânicos certificados",
    cor: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: CreditCard,
    titulo: "Parcelas a partir de R$ 349",
    desc: "Menor taxa de financiamento da região",
    cor: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: HeadphonesIcon,
    titulo: "Atendimento dedicado",
    desc: "Um consultor exclusivo para você do início ao fim",
    cor: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
];

export function DestaquesBanner() {
  return (
    <section className="container py-10 -mt-6 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {itens.map(({ icon: Icon, titulo, desc, cor, bg }) => (
          <div
            key={titulo}
            className="flex flex-col gap-3 p-5 rounded-2xl border bg-card shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4.5 h-4.5 ${cor}`} strokeWidth={2} />
            </div>
            <div>
              <p className="font-display font-bold text-sm leading-tight">{titulo}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

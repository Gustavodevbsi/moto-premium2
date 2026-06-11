import { Star, Quote } from "lucide-react";

const depoimentos = [
  {
    nome: "Anderson Silva",
    cidade: "Carpina · PE",
    texto: "Processo super rápido, sem enrolação. Em 2 dias minha moto já estava na garagem. Atendimento de outro nível aqui mesmo em Carpina!",
    nota: 5,
    moto: "Honda CG 160 Fan",
    ini: "AS",
    cor: "from-indigo-500 to-blue-500",
  },
  {
    nome: "Fernanda Lima",
    cidade: "Limoeiro · PE",
    texto: "O simulador é demais, vi minha parcela certinha antes de ir à loja. Transparência total, nunca tinha visto isso numa loja de moto.",
    nota: 5,
    moto: "Yamaha Factor 150",
    ini: "FL",
    cor: "from-violet-500 to-purple-500",
  },
  {
    nome: "Marcelo Souza",
    cidade: "Lagoa do Carro · PE",
    texto: "Tinha dúvidas sobre meu score mas a equipe me orientou direitinho e consegui aprovação com ótima taxa. Recomendo 100%!",
    nota: 5,
    moto: "Honda Biz 125",
    ini: "MS",
    cor: "from-blue-500 to-cyan-500",
  },
];

export function Depoimentos() {
  return (
    <section id="depoimentos" className="container py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 mb-3">
          Quem já realizou o sonho
        </p>
        <h2 className="font-display text-4xl font-extrabold">O que dizem nossos clientes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {depoimentos.map((d) => (
          <div
            key={d.nome}
            className="rounded-2xl border bg-card p-6 space-y-4 shadow-card hover:shadow-card-hover transition-shadow relative overflow-hidden"
          >
            {/* Quote decorativa */}
            <Quote className="absolute top-5 right-5 w-8 h-8 text-indigo-100 dark:text-indigo-900/50" />

            <div className="flex gap-0.5">
              {Array.from({ length: d.nota }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              "{d.texto}"
            </p>

            <div className="flex items-center gap-3 pt-3 border-t">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${d.cor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                {d.ini}
              </div>
              <div>
                <p className="font-semibold text-sm">{d.nome}</p>
                <p className="text-xs text-muted-foreground">{d.cidade} · {d.moto}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

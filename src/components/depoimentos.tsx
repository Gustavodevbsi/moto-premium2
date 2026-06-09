import { Star, Quote } from "lucide-react";

const depoimentos = [
  {
    nome: "Carlos Mendes",
    cidade: "São Paulo · SP",
    texto: "Processo super rápido. Em 2 dias minha moto já estava na minha garagem. Atendimento de outro nível, sem enrolação.",
    nota: 5,
    moto: "Honda CB 500F",
    ini: "CM",
    cor: "from-indigo-500 to-blue-500",
  },
  {
    nome: "Juliana Santos",
    cidade: "Campinas · SP",
    texto: "O simulador é incrível. Vi exatamente minha parcela antes de ir à loja. Transparência total. Nunca tinha visto isso.",
    nota: 5,
    moto: "Yamaha MT-03",
    ini: "JS",
    cor: "from-violet-500 to-purple-500",
  },
  {
    nome: "Rodrigo Oliveira",
    cidade: "Santos · SP",
    texto: "Tinha dúvidas sobre meu score mas a equipe me orientou e consegui aprovação com taxa boa. Recomendo 100%.",
    nota: 5,
    moto: "BMW G 310 R",
    ini: "RO",
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

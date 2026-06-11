import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, HeadphonesIcon } from "lucide-react";

const SUPORTE_NUMERO = "5581991082261";
const SUPORTE_MSG = encodeURIComponent(
  "Olá! 👋 Preciso de suporte com o sistema da Prime Motos. Pode me ajudar?"
);

export function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg w-fit">
            <Image src="/logo-prime.png" alt="Prime Motos" width={36} height={36} className="rounded-full" />
            Prime<span className="text-gradient"> Motos</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Especialistas em motos em Carpina-PE. Transparência, agilidade e as melhores condições de financiamento.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Navegação</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Home", "/"],
              ["Estoque", "/estoque"],
              ["Simulador", "/#simulador"],
              ["Depoimentos", "/#depoimentos"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contato</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span suppressHydrationWarning>(81) 9 9547-3370</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              contato@primemotos.com.br
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              Av. Agamenon Magalhães - São José, Carpina/PE · 55810-000
            </li>
          </ul>
        </div>
      </div>

      {/* Barra de suporte */}
      <div className="border-t bg-muted/30">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <HeadphonesIcon className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Precisa de suporte?</p>
              <p className="text-xs text-muted-foreground">Fale direto com nossa equipe técnica pelo WhatsApp</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${SUPORTE_NUMERO}?text=${SUPORTE_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shrink-0 shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.526a.75.75 0 00.918.918l5.671-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.717 9.717 0 01-4.964-1.362l-.355-.211-3.669.952.974-3.558-.231-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Prime Motos - Carpina/PE. Todos os direitos reservados.</p>
          <a
            href={`https://wa.me/${SUPORTE_NUMERO}?text=${encodeURIComponent("Olá! 👋 Vi o sistema da Prime Motos e fiquei impressionado. Gostaria de saber mais sobre os serviços da Assessoria Falcon!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors group"
          >
            Desenvolvido por
            <span className="font-semibold text-indigo-500 group-hover:text-indigo-400 transition-colors">
              Assessoria Falcon
            </span>
            <span className="text-indigo-500/60 group-hover:text-indigo-400 transition-colors">🦅</span>
          </a>
        </div>
      </div>
    </footer>
  );
}


import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const SUPORTE_NUMERO = "5581991082261";

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
              ["Política de Privacidade", "/privacidade"],
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


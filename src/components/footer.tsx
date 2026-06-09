import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-lg w-fit">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <MotoIcon className="w-5 h-4 text-white" strokeWidth={1.8} />
            </div>
            Moto<span className="text-gradient">Shop</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Especialistas em financiamento de motos. Transparência, agilidade e as menores taxas da região.
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
              <span suppressHydrationWarning>(11) 9 9999-9999</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              contato@motoshop.com.br
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              São Paulo, SP
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MotoShop Premium. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}

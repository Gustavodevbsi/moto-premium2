import Link from "next/link";
import Image from "next/image";
import { Gauge, Calendar, ArrowUpRight } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";
import { formatarMoeda, formatarNumero } from "@/lib/financiamento";
import { cn } from "@/lib/utils";
import { anoAtual } from "@/lib/utils";

interface MotoCardProps {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  preco: number;
  foto?: string;
  destaque?: boolean;
}

export function MotoCard({ id, marca, modelo, ano, km, preco, foto, destaque }: MotoCardProps) {
  const nova = ano >= anoAtual();

  return (
    <Link href={`/moto/${id}`} className="block group">
      <article className={cn(
        "rounded-2xl overflow-hidden bg-card border shadow-card group-hover:shadow-brand transition-all duration-300 group-hover:-translate-y-1",
        destaque && "ring-1 ring-indigo-500/30"
      )}>

        {/* Imagem */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          {foto ? (
            <Image
              src={foto}
              alt={`${marca} ${modelo}`}
              fill
              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MotoIcon className="w-20 h-16 text-muted-foreground/20" strokeWidth={1} />
            </div>
          )}

          {/* Overlay sutil no hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {nova && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-indigo-600 text-white shadow-sm">
                Nova
              </span>
            )}
            {destaque && (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-amber-400 text-amber-900">
                Destaque
              </span>
            )}
          </div>

          {/* Botão flutuante no hover */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center shadow-brand-sm">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-3.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{marca}</p>
            <h3 className="font-display font-bold text-[1.05rem] leading-tight mt-0.5">{modelo}</h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />{ano}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3 h-3" />{formatarNumero(km)} km
            </span>
          </div>

          <div className="flex items-end justify-between pt-0.5 border-t border-dashed">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Preço</p>
              <p className="text-xl font-display font-bold text-gradient">{formatarMoeda(preco)}</p>
            </div>
            <p className="text-xs text-muted-foreground pb-0.5">Ver detalhes →</p>
          </div>
        </div>
      </article>
    </Link>
  );
}

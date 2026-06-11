"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";
import { cn } from "@/lib/utils";

interface GaleriaProps {
  fotos: { url: string; alt?: string }[];
  modelo: string;
}

export function Galeria({ fotos, modelo }: GaleriaProps) {
  const [ativa, setAtiva] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const all = fotos.length > 0 ? fotos : [{ url: "", alt: modelo }];
  const atual = all[ativa];

  const anterior = () => setAtiva((p) => (p === 0 ? all.length - 1 : p - 1));
  const proximo = () => setAtiva((p) => (p === all.length - 1 ? 0 : p + 1));

  return (
    <>
      <div className="space-y-3">
        {/* Principal */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted group">
          {atual.url ? (
            <Image src={atual.url} alt={atual.alt || modelo} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" priority quality={90} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <MotoIcon className="w-24 h-20 text-muted-foreground/20" strokeWidth={1} />
            </div>
          )}

          {all.length > 1 && (
            <>
              <button onClick={anterior} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={proximo} className="absolute right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <button onClick={() => setFullscreen(true)} className="absolute right-3 top-3 w-8 h-8 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-medium">
            {ativa + 1} / {all.length}
          </div>
        </div>

        {/* Thumbnails */}
        {all.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {all.map((f, i) => (
              <button
                key={i}
                onClick={() => setAtiva(i)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                  i === ativa ? "border-primary" : "border-transparent hover:border-muted-foreground"
                )}
              >
                {f.url ? (
                  <Image src={f.url} alt={f.alt || modelo} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                  <MotoIcon className="w-8 h-6 text-muted-foreground/30" strokeWidth={1.2} />
                </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <button onClick={() => setFullscreen(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>

          {all.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); anterior(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); proximo(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-4xl aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            {atual.url ? (
              <Image src={atual.url} alt={atual.alt || modelo} fill className="object-contain" sizes="100vw" quality={95} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/80">
              <MotoIcon className="w-32 h-24 text-white/20" strokeWidth={0.8} />
            </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

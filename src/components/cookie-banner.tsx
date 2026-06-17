"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "prime-motos-cookies-aceitos";

export function CookieBanner() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisivel(true);
    }
  }, []);

  function aceitar() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisivel(false);
  }

  if (!visivel) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="container max-w-4xl">
        <div className="rounded-2xl border bg-card shadow-lg px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
            Usamos cookies essenciais para o funcionamento do site. Ao continuar navegando, você concorda com nossa{" "}
            <Link href="/privacidade" className="text-indigo-500 underline underline-offset-2 hover:text-indigo-400">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={aceitar}
              className="px-4 py-2 rounded-xl gradient-brand text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Entendi
            </button>
            <button
              onClick={aceitar}
              aria-label="Fechar"
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

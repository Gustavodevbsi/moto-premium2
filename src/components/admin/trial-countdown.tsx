"use client";

import { useEffect, useState } from "react";
import { Timer, Play, RotateCcw } from "lucide-react";

const STORAGE_KEY = "prime_trial_start";
const TRIAL_DAYS = 7;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function TrialCountdown() {
  const [startDate, setStartDate] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setStartDate(Number(stored));
  }, []);

  useEffect(() => {
    if (!startDate) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  function activate() {
    const ts = Date.now();
    localStorage.setItem(STORAGE_KEY, String(ts));
    setStartDate(ts);
    setNow(Date.now());
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setStartDate(null);
  }

  if (!mounted) return null;

  const endDate = startDate ? startDate + TRIAL_DAYS * 24 * 60 * 60 * 1000 : null;
  const remaining = endDate ? Math.max(0, endDate - now) : null;
  const expired = remaining === 0;

  const days    = remaining !== null ? Math.floor(remaining / (1000 * 60 * 60 * 24)) : 0;
  const hours   = remaining !== null ? Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0;
  const minutes = remaining !== null ? Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)) : 0;
  const seconds = remaining !== null ? Math.floor((remaining % (1000 * 60)) / 1000) : 0;

  const progress = startDate && endDate ? ((now - startDate) / (endDate - startDate)) * 100 : 0;

  return (
    <div className={`rounded-2xl border bg-card p-5 space-y-4 ${expired ? "border-red-300 dark:border-red-700" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${expired ? "text-red-500" : startDate ? "text-amber-500" : "text-muted-foreground"}`} />
          <p className="text-sm font-medium">Período de Teste</p>
        </div>
        {startDate && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Resetar
          </button>
        )}
      </div>

      {!startDate ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Trial de 7 dias não iniciado.</p>
          <button
            onClick={activate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity w-full justify-center"
          >
            <Play className="w-4 h-4" />
            Ativar agora
          </button>
        </div>
      ) : expired ? (
        <div className="text-center py-2">
          <p className="text-red-500 font-bold text-lg">Trial expirado</p>
          <p className="text-xs text-muted-foreground mt-1">
            Iniciado em {new Date(startDate).toLocaleDateString("pt-BR")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { v: pad(days),    l: "dias" },
              { v: pad(hours),   l: "horas" },
              { v: pad(minutes), l: "min" },
              { v: pad(seconds), l: "seg" },
            ].map(({ v, l }) => (
              <div key={l} className="rounded-xl bg-muted py-2">
                <p className="text-xl font-extrabold font-display">{v}</p>
                <p className="text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-brand transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              Expira em {new Date(endDate!).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

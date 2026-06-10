"use client";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function ThemeToggle({ scrolled }: { scrolled: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "p-2 rounded-lg transition-colors",
        scrolled ? "hover:bg-muted text-muted-foreground" : "hover:bg-white/10 text-slate-300"
      )}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

const links = [
  { href: "/estoque", label: "Estoque" },
  { href: "/#simulador", label: "Simulador" },
  { href: "/#depoimentos", label: "Depoimentos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-background/90 backdrop-blur-xl border-b shadow-sm"
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Image src="/logo-prime.png" alt="Prime Motos" width={40} height={40} className="rounded-full" />
          <span className={cn(scrolled ? "text-foreground" : "text-white")}>
            Prime<span className="text-gradient"> Motos</span>
          </span>
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                scrolled
                  ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <ThemeToggle scrolled={scrolled} />

          <Link
            href="/estoque"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-brand-sm"
          >
            Ver estoque
          </Link>

          <button
            className={cn("md:hidden p-2 rounded-lg transition-colors",
              scrolled ? "hover:bg-muted" : "hover:bg-white/10 text-white"
            )}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl px-4 py-5 flex flex-col gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/estoque"
            className="mt-2 flex items-center justify-center px-4 py-3 rounded-xl gradient-brand text-white font-semibold text-sm"
            onClick={() => setOpen(false)}
          >
            Ver estoque completo
          </Link>
        </div>
      )}
    </header>
  );
}


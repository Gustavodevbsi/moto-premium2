"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Bike, Users, Settings, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin",                  label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/admin/motos",            label: "Motos",        icon: Bike },
  { href: "/admin/leads",            label: "Leads",        icon: Users },
  { href: "/admin/configuracoes",    label: "Config",       icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-card min-h-screen shrink-0">
        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b">
          <Link href="/admin" className="flex items-center gap-2.5 font-display font-bold text-base">
            <Image src="/logo-prime.png" alt="Prime Motos" width={32} height={32} className="rounded-full" />
            Prime<span className="text-gradient"> Motos</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "gradient-brand text-white shadow-brand-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Ver site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t flex items-center justify-around h-16 px-2">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </nav>
    </>
  );
}

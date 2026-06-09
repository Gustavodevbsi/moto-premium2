"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { MotoIcon } from "@/components/icons/moto-icon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const d = await res.json();
      setErro(d.error || "Credenciais inválidas");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[80px]" />

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-brand">
            <MotoIcon className="w-8 h-7 text-white" strokeWidth={1.6} />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-white">MotoShop Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Acesse o painel de gestão</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-7 space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@motoshop.com.br"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPass ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/8 border border-white/12 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {erro && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-brand disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Acessar painel"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-4">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { formatarMoeda } from "@/lib/financiamento";
import { Bike, Users, TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { TrialCountdown } from "@/components/admin/trial-countdown";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalMotos, motosDisp, totalLeads,
    leadsNovos, leadsAprovados,
    leadsRecentes, valoresMoeda,
  ] = await Promise.all([
    prisma.moto.count(),
    prisma.moto.count({ where: { status: "DISPONIVEL" } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NOVO" } }),
    prisma.lead.count({ where: { status: "APROVADO" } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { moto: { select: { marca: true, modelo: true } } },
    }),
    prisma.lead.aggregate({ _sum: { valorParcela: true } }),
  ]);

  return { totalMotos, motosDisp, totalLeads, leadsNovos, leadsAprovados, leadsRecentes, valoresMoeda };
}

const STATUS_COLORS: Record<string, string> = {
  NOVO: "bg-blue-100 text-blue-700",
  EM_ATENDIMENTO: "bg-yellow-100 text-yellow-700",
  APROVADO: "bg-green-100 text-green-700",
  REPROVADO: "bg-red-100 text-red-700",
  CONVERTIDO: "bg-purple-100 text-purple-700",
};

const STATUS_LABELS: Record<string, string> = {
  NOVO: "Novo",
  EM_ATENDIMENTO: "Em Atendimento",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  CONVERTIDO: "Convertido",
};

export default async function AdminDashboard() {
  const { totalMotos, motosDisp, totalLeads, leadsNovos, leadsAprovados, leadsRecentes } = await getStats();

  const cards = [
    { label: "Total de Motos", value: totalMotos, sub: `${motosDisp} disponíveis`, icon: Bike, color: "bg-orange-500" },
    { label: "Total de Leads", value: totalLeads, sub: `${leadsNovos} novos`, icon: Users, color: "bg-blue-500" },
    { label: "Aprovações", value: leadsAprovados, sub: "créditos aprovados", icon: CheckCircle, color: "bg-green-500" },
    { label: "Taxa Conversão", value: `${totalLeads ? ((leadsAprovados / totalLeads) * 100).toFixed(1) : 0}%`, sub: "leads aprovados", icon: TrendingUp, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Trial */}
      <div className="max-w-xs">
        <TrialCountdown />
      </div>

      {/* Leads recentes */}
      <div className="rounded-2xl border bg-card">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-bold">Leads Recentes</h2>
          <a href="/admin/leads" className="text-sm text-primary hover:underline">Ver todos</a>
        </div>
        <div className="divide-y">
          {leadsRecentes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum lead ainda</p>
            </div>
          ) : (
            leadsRecentes.map((lead) => (
              <div key={lead.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {lead.moto.marca} {lead.moto.modelo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lead.numeroParcelas}x de {formatarMoeda(lead.valorParcela)} · Entrada {formatarMoeda(lead.valorEntrada)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || "bg-muted"}`}>
                  {STATUS_LABELS[lead.status] || lead.status}
                </span>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const MAP: Record<string, { label: string; class: string }> = {
  DISPONIVEL: { label: "Disponível", class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  RESERVADA:  { label: "Reservada",  class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  VENDIDA:    { label: "Vendida",    class: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400" },
  NOVO:           { label: "Novo",           class: "bg-blue-100 text-blue-700" },
  EM_ATENDIMENTO: { label: "Em Atendimento", class: "bg-yellow-100 text-yellow-700" },
  APROVADO:       { label: "Aprovado",       class: "bg-green-100 text-green-700" },
  REPROVADO:      { label: "Reprovado",      class: "bg-red-100 text-red-700" },
  CONVERTIDO:     { label: "Convertido",     class: "bg-purple-100 text-purple-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = MAP[status] || { label: status, class: "bg-muted text-muted-foreground" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.class}`}>
      {s.label}
    </span>
  );
}

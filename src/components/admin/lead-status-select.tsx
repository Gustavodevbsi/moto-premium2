"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = [
  { value: "NOVO", label: "Novo" },
  { value: "EM_ATENDIMENTO", label: "Em Atendimento" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
  { value: "CONVERTIDO", label: "Convertido" },
];

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setSaving(true);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setCurrent(newStatus);
    router.refresh();
    setSaving(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={saving}
      className="px-2 py-1.5 rounded-lg border bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}

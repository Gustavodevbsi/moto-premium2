"use client";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteMotoButton({ id, nome }: { id: string; nome: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Deseja realmente excluir "${nome}"? Esta ação é irreversível.`)) return;
    setLoading(true);
    await fetch(`/api/motos/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
      title="Excluir"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

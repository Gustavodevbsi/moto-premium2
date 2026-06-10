"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { anoAtual } from "@/lib/utils";
import { X, Upload, ImagePlus, Loader2 } from "lucide-react";

interface MotoFormProps {
  initial?: {
    id?: string;
    marca?: string;
    modelo?: string;
    ano?: number;
    km?: number;
    preco?: number;
    descricao?: string;
    status?: string;
    destaque?: boolean;
    revisada?: boolean;
    garantia?: boolean;
    procedencia?: string;
    fotos?: { url: string; alt?: string }[];
  };
}

export function MotoForm({ initial }: MotoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    marca: initial?.marca || "",
    modelo: initial?.modelo || "",
    ano: initial?.ano || anoAtual(),
    km: initial?.km || 0,
    preco: initial?.preco || 0,
    descricao: initial?.descricao || "",
    status: initial?.status || "DISPONIVEL",
    destaque: initial?.destaque || false,
    revisada: initial?.revisada || false,
    garantia: initial?.garantia || false,
    procedencia: initial?.procedencia || "Nacional",
  });

  const [fotos, setFotos] = useState<{ url: string; alt: string }[]>(
    initial?.fotos?.map((f) => ({ url: f.url, alt: f.alt || "" })) || []
  );
  const [uploading, setUploading] = useState(false);
  const [uploadErro, setUploadErro] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const removeFoto = (i: number) => setFotos((p) => p.filter((_, idx) => idx !== i));

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadErro("");

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setFotos((p) => [...p, { url, alt: "" }]);
      } else {
        const { error } = await res.json();
        setUploadErro(error || "Erro ao enviar imagem");
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const payload = { ...form, fotos };
    const url = initial?.id ? `/api/motos/${initial.id}` : "/api/motos";
    const method = initial?.id ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/motos");
      router.refresh();
    } else {
      const data = await res.json();
      setErro(typeof data.error === "string" ? data.error : "Erro ao salvar");
    }
    setLoading(false);
  }

  const field = (label: string, children: React.ReactNode) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );

  const input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {erro}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h3 className="font-bold border-b pb-3">Informações Básicas</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("Marca *", input({ value: form.marca, onChange: (e) => update("marca", e.target.value), placeholder: "Honda, Yamaha, BMW...", required: true }))}
          {field("Modelo *", input({ value: form.modelo, onChange: (e) => update("modelo", e.target.value), placeholder: "CB 500F, MT-07, R1200...", required: true }))}
          {field("Ano *", input({ type: "number", value: form.ano, onChange: (e) => update("ano", Number(e.target.value)), min: 1990, max: anoAtual() + 1, required: true }))}
          {field("Quilometragem *", input({ type: "number", value: form.km, onChange: (e) => update("km", Number(e.target.value)), min: 0, required: true }))}
          {field("Preço *", input({ type: "number", value: form.preco, onChange: (e) => update("preco", Number(e.target.value)), min: 1, step: 100, required: true }))}
          {field("Procedência", input({ value: form.procedencia, onChange: (e) => update("procedencia", e.target.value), placeholder: "Nacional, Importado..." }))}
        </div>

        {field("Descrição", (
          <textarea
            value={form.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            rows={4}
            placeholder="Descreva a moto, diferenciais, histórico..."
            className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h3 className="font-bold border-b pb-3">Status e Diferenciais</h3>

        {field("Status", (
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADA">Reservada</option>
            <option value="VENDIDA">Vendida</option>
          </select>
        ))}

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "destaque", label: "⭐ Destaque" },
            { key: "revisada", label: "🔧 Revisada" },
            { key: "garantia", label: "🛡️ Garantia" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border hover:border-primary transition-colors">
              <input
                type="checkbox"
                checked={(form as any)[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h3 className="font-bold border-b pb-3">Fotos</h3>

        {/* Área de upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed rounded-xl py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <ImagePlus className="w-8 h-8" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Enviando..." : "Clique para adicionar fotos"}
          </span>
          <span className="text-xs">JPG, PNG ou WebP · máx. 5MB por foto · várias de uma vez</span>
        </button>

        {uploadErro && (
          <p className="text-sm text-destructive">{uploadErro}</p>
        )}

        {fotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fotos.map((f, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] bg-muted">
                <img src={f.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                >
                  <X className="w-3 h-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-xs">
                    Capa
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl gradient-brand text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Salvando..." : initial?.id ? "Salvar Alterações" : "Cadastrar Moto"}
        </button>
      </div>
    </form>
  );
}

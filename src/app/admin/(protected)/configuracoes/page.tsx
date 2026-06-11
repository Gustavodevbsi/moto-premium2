import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/admin/config-form";
import { HeadphonesIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const SUPORTE_MSG = encodeURIComponent(
  "Olá! 👋 Preciso de suporte com o sistema da Prime Motos. Pode me ajudar?"
);

export default async function ConfiguracoesPage() {
  let config = await prisma.configuracao.findFirst();
  if (!config) {
    config = await prisma.configuracao.create({ data: {} });
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie taxas, WhatsApp e identidade visual</p>
      </div>

      <ConfigForm initial={config} />

      {/* Suporte */}
      <div className="rounded-2xl border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <HeadphonesIcon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">Precisa de suporte?</p>
            <p className="text-xs text-muted-foreground">Fale direto com a equipe técnica da Assessoria Falcon</p>
          </div>
        </div>
        <a
          href={`https://wa.me/5581991082261?text=${SUPORTE_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shrink-0 w-full sm:w-auto justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.526a.75.75 0 00.918.918l5.671-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.717 9.717 0 01-4.964-1.362l-.355-.211-3.669.952.974-3.558-.231-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
          </svg>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}

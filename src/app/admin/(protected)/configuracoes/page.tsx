import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/admin/config-form";

export const dynamic = "force-dynamic";

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
    </div>
  );
}

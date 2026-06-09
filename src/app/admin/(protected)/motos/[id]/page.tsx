import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MotoForm } from "@/components/admin/moto-form";

export default async function EditarMotoPage({ params }: { params: { id: string } }) {
  const moto = await prisma.moto.findUnique({
    where: { id: params.id },
    include: { fotos: { orderBy: { ordem: "asc" } } },
  });

  if (!moto) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold">Editar Moto</h1>
        <p className="text-muted-foreground">{moto.marca} {moto.modelo} {moto.ano}</p>
      </div>
      <MotoForm initial={{ ...moto, fotos: moto.fotos }} />
    </div>
  );
}

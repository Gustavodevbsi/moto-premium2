import { prisma } from "@/lib/prisma";
import { MotosTable } from "@/components/admin/motos-table";

export const dynamic = "force-dynamic";

export default async function AdminMotosPage() {
  const motos = await prisma.moto.findMany({
    include: { fotos: { take: 1, orderBy: { ordem: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return <MotosTable motos={motos} />;
}

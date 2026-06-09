import { MotoForm } from "@/components/admin/moto-form";

export default function NovaMotoPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold">Nova Moto</h1>
        <p className="text-muted-foreground">Cadastre uma nova moto no estoque</p>
      </div>
      <MotoForm />
    </div>
  );
}

import { ReactNode } from "react";

// Layout raiz do admin — apenas encapsula.
// A proteção de rota é feita em cada sub-layout (exceto /login).
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

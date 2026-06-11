"use client";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppButton({ numero }: { numero?: string }) {
  const [telefone, setTelefone] = useState(numero || "5581995473370");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        const num = d.whatsappNumero?.replace(/\D/g, "");
        if (num && num.length >= 10) setTelefone(num);
      })
      .catch(() => {});
  }, []);

  const msg = encodeURIComponent(
    "Olá! 👋 Vim pelo site da Prime Motos e gostaria de saber mais sobre as motos disponíveis e condições de financiamento. Pode me ajudar?"
  );

  return (
    <a
      href={`https://wa.me/${telefone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:block">Fale conosco</span>
    </a>
  );
}

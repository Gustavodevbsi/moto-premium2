import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WhatsAppButton } from "@/components/whatsapp-button";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MotoShop Premium | Financiamento Facilitado",
    template: "%s | MotoShop Premium",
  },
  description:
    "Encontre sua moto ideal com financiamento facilitado. Simule suas parcelas e saia com sua moto hoje.",
  keywords: ["motos", "financiamento de motos", "comprar moto", "simulação financiamento"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MotoShop Premium",
  },
  // Impede que Safari/Chrome mobile reforje números de telefone em links
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${syne.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <WhatsAppButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

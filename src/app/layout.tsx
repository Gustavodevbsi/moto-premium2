import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prime Motos | Financiamento Facilitado em Carpina-PE",
    template: "%s | Prime Motos",
  },
  description:
    "Prime Motos em Carpina-PE. Encontre sua moto ideal com financiamento facilitado. Simule suas parcelas e saia com sua moto hoje.",
  keywords: ["motos", "financiamento de motos", "comprar moto", "Prime Motos", "Carpina", "Pernambuco"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Prime Motos",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

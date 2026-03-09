import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluxplus — Gestão financeira pelo WhatsApp",
  description: "Controle suas finanças pessoais ou a dois direto pelo WhatsApp. Simples, rápido e inteligente.",
  keywords: "finanças, whatsapp, controle financeiro, casal, gestão financeira",
  openGraph: {
    title: "Fluxplus — Gestão financeira pelo WhatsApp",
    description: "Controle suas finanças pessoais ou a dois direto pelo WhatsApp.",
    url: "https://fluxplus.com.br",
    siteName: "Fluxplus",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

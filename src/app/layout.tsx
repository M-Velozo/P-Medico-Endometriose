import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastNotifications } from "@/components/toast-notifications";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Classificação de Endometriose",
  description: "Classificação de Keckstein para diagnóstico padronizado",
  keywords: ["Endometriose", "Keckstein", "Classificação", "Ginecologia", "Saúde"],
  authors: [{ name: "Sistema de Classificação de Endometriose" }],
  openGraph: {
    title: "Sistema de Classificação de Endometriose",
    description: "Classificação de Keckstein para diagnóstico padronizado",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de Classificação de Endometriose",
    description: "Classificação de Keckstein para diagnóstico padronizado",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ToastNotifications>
          {children}
        </ToastNotifications>
      </body>
    </html>
  );
}

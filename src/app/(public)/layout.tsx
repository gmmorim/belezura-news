import React from "react";
import { Header } from "@/components/public/Header";
import { CategoryNav } from "@/components/public/CategoryNav";
import { Footer } from "@/components/public/Footer";
import { CookieConsent } from "@/components/public/CookieConsent";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Header com Logo animado e utilitários */}
      <Header />

      {/* Menu fixo com categorias na tipografia Alleron */}
      <CategoryNav />

      {/* Conteúdo dinâmico da página */}
      <main className="flex-1 w-full">{children}</main>

      {/* Rodapé editorial com CTA comercial e newsletter */}
      <Footer />

      {/* Banner flutuante não-intrusivo de consentimento LGPD/Cookies */}
      <CookieConsent />
    </div>
  );
}

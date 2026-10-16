import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.com.br"),
  title: "Belezura News | Portal de Beleza, Moda, Tendências & Negócios",
  description:
    "O portal editorial contemporâneo sobre beleza, moda, negócios, lifestyle e reviews de produtos.",
  keywords: ["beleza", "moda", "lifestyle", "business", "reviews", "belezura news"],
  authors: [{ name: "Redação Belezura News" }],
  openGraph: {
    title: "Belezura News",
    description: "Portal de Beleza, Moda, Tendências & Negócios",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6305",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen w-full overflow-x-hidden flex flex-col font-sans selection:bg-[#ff6305] selection:text-white bg-[#FAF9F6]">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

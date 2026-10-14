"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cookie, X } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const STORAGE_KEY = "belezura_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já tomou uma decisão prévia
    const storedChoice = localStorage.getItem(STORAGE_KEY);
    if (!storedChoice) {
      // Exibe suavemente com pequeno delay para não agredir no carregamento inicial
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      // Aplica o consentimento salvo ao GA4 caso já tenha escolhido
      applyConsent(storedChoice === "all");
    }
  }, []);

  const applyConsent = (acceptAll: boolean) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: acceptAll ? "granted" : "denied",
        ad_storage: "denied", // Belezura News não utiliza cookies invasivos de anúncios de terceiros
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem(STORAGE_KEY, "all");
    applyConsent(true);
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    localStorage.setItem(STORAGE_KEY, "essential_only");
    applyConsent(false);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Consentimento de Cookies e Privacidade"
          initial={{ y: 60, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-xl z-50 pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#141414]/95 text-white p-4 sm:p-5 shadow-2xl shadow-black/40 border border-neutral-800 backdrop-blur-md">
            {/* Glow sutil na identidade Laranja Belezura */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6305]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-3">
              {/* Header do Banner */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#ff6305]/15 text-[#ff6305] border border-[#ff6305]/25">
                    <Cookie className="w-4 h-4" />
                  </span>
                  <span className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-200">
                    Sua Privacidade Importa
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="text-neutral-500 hover:text-neutral-300 transition-colors p-1 rounded-md"
                  aria-label="Fechar e manter apenas essenciais"
                  title="Manter apenas essenciais"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mensagem editorial e sucinta */}
              <p className="text-xs text-neutral-300 leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento do portal e métricas anônimas (Google Analytics) para aprimorar nossa curadoria de notícias, conforme nossa{" "}
                <Link
                  href="/politica-de-privacidade"
                  className="text-[#ff6305] hover:underline underline-offset-2 font-medium transition-colors"
                >
                  Política de Privacidade (LGPD)
                </Link>
                .
              </p>

              {/* Ações não intrusivas */}
              <div className="flex flex-col-reverse xs:flex-row items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="font-alleron w-full xs:w-auto px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-all duration-150"
                >
                  Recusar Não Essenciais
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="font-alleron w-full xs:w-auto px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#ff6305] hover:bg-orange-600 active:scale-95 shadow-md shadow-orange-500/20 transition-all duration-150 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Aceitar Todos</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

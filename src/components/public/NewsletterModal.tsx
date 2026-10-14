"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Trava scroll do body
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Por favor, digite um e-mail válido.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "header_curadoria_modal" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Não foi possível cadastrar seu e-mail no momento.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Erro de conexão. Tente novamente.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setEmail("");
    setErrorMessage("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-[#FAF9F6] border border-neutral-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {status === "success" ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-recoleta text-2xl font-bold text-neutral-900">
                  Bem-vindo à nossa curadoria!
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Seu e-mail foi cadastrado com sucesso. Em breve você receberá as pautas mais quentes, tendências e análises direto na sua caixa de entrada.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-alleron px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header do Modal */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-[#ff6305] text-[11px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Belezura Drops</span>
                  </div>
                  <h3 className="font-recoleta text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight leading-tight">
                    Receba nossa curadoria exclusiva
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Toda semana, um compilado criterioso com os lançamentos de cosméticos, tendências estéticas, análises de mercado e bastidores da beleza.
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu melhor e-mail..."
                      className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all shadow-sm"
                      autoFocus
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-red-600 font-medium pl-1">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff6305] text-white rounded-2xl font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-[0.99] transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span>Cadastrando...</span>
                    ) : (
                      <>
                        <span>Quero Receber Gratuitamente</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[11px] text-neutral-400 text-center">
                  Zero spam. Conteúdo 100% gratuito. Cancele quando quiser com 1 clique.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function InlineNewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Por favor, informe um e-mail válido.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "post_footer_inline" }),
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

  return (
    <div className="w-full my-12 p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white relative overflow-hidden border border-neutral-800 shadow-xl">
      {/* Glow de fundo */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#ff6305]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curadoria Editorial</span>
        </div>

        <h3 className="font-recoleta text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
          Inscreva-se na nossa Newsletter
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
          Receba o <strong className="text-white">Belezura Drops</strong> com as principais notícias, lançamentos e bastidores da beleza diretamente na sua caixa de entrada toda manhã.
        </p>

        {status === "success" ? (
          <div className="pt-3 flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Obrigado! Seu e-mail foi cadastrado com sucesso na nossa lista vip.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto space-y-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu melhor e-mail..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff6305] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto font-alleron px-5 py-3 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 shrink-0 inline-flex items-center justify-center gap-1.5"
              >
                {status === "loading" ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <span>Cadastrar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400 text-left pt-1 font-medium">
                {errorMessage}
              </p>
            )}

            <p className="text-[11px] text-neutral-400 pt-1">
              Gratuito. Zero spam. Cancele sua inscrição quando desejar com 1 clique.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

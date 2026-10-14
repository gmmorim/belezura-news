"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { TikTokIcon, ThreadsIcon, XIcon } from "@/components/icons/SocialIcons";
import { CATEGORIES } from "./CategoryNav";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/belezuranews",
    linkedin: "https://linkedin.com/company/belezuranews",
    twitter: "https://x.com/belezuranews",
    threads: "https://threads.net/@belezuranews",
    tiktok: "https://tiktok.com/@belezuranews",
    youtube: "",
  });
  const [contactEmail, setContactEmail] = useState("contato@belezuranews.com.br");
  const [commercialUrl, setCommercialUrl] = useState("mailto:comercial@belezuranews.com.br");

  // Carregar configurações dinâmicas gerenciadas no Painel Admin
  useEffect(() => {
    async function loadFooterConfigs() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.configs) {
            setSocialLinks({
              instagram: data.configs.social_instagram_url ?? "https://instagram.com/belezuranews",
              linkedin: data.configs.social_linkedin_url ?? "https://linkedin.com/company/belezuranews",
              twitter: data.configs.social_twitter_url ?? "https://x.com/belezuranews",
              threads: data.configs.social_threads_url ?? "https://threads.net/@belezuranews",
              tiktok: data.configs.social_tiktok_url ?? "",
              youtube: data.configs.social_youtube_url ?? "",
            });
            if (data.configs.footer_contact_email) {
              setContactEmail(data.configs.footer_contact_email);
            }
            if (data.configs.footer_commercial_url) {
              setCommercialUrl(data.configs.footer_commercial_url);
            }
          }
        }
      } catch (err) {
        console.warn("Aviso ao carregar configurações do rodapé:", err);
      }
    }
    loadFooterConfigs();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // Simulação ou chamada do endpoint
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  return (
    <footer className="w-full bg-[#111111] text-white pt-16 sm:pt-20 pb-12 border-t border-neutral-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner de Conversão: Newsletter Exclusiva */}
        <div className="rounded-none bg-neutral-900 border border-neutral-800 p-6 sm:p-10 lg:p-12 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff6305]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[11px] font-bold uppercase tracking-wider bg-[#ff6305]/15 text-[#ff6305] border border-[#ff6305]/30 mb-4">
                Belezura Drops • Gratuito
              </span>
              <h3 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Receba a curadoria de beleza, moda e negócios no seu email.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                Toda manhã, um resumo afiado do que você realmente precisa saber antes do café. Sem spam, só conteúdo com identidade.
              </p>
            </div>

            <div className="lg:col-span-5">
              {status === "success" ? (
                <div className="flex items-center gap-3 p-4 rounded-none bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <p className="text-sm font-medium">
                    Pronto! Você agora faz parte dos insiders do Belezura News.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu melhor e-mail..."
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-none bg-neutral-800/90 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="font-alleron whitespace-nowrap inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-none bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all duration-200 shadow-lg shadow-orange-500/20 disabled:opacity-50"
                  >
                    <span>{status === "loading" ? "Inscrevendo..." : "Inscreva-se"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Grade de Informações, Editorias e CTA Obrigatório */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          {/* Coluna 1: Marca & Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group focus:outline-none" aria-label="Página inicial Belezura">
              <img
                src="/images/logo-footer.png"
                alt="Belezura"
                width={160}
                height={113}
                className="h-16 sm:h-20 w-auto object-contain transition-all duration-200 group-hover:brightness-110 group-hover:opacity-90"
              />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              O portal que conecta beleza, moda, negócios e lifestyle, com curadoria de tendências, novidades do mercado e reviews sinceros.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="Instagram Belezura News"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="LinkedIn Belezura News"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="Twitter / X Belezura News"
                >
                  <XIcon className="w-4 h-4" />
                </a>
              )}
              {socialLinks.threads && (
                <a
                  href={socialLinks.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="Threads Belezura News"
                >
                  <ThreadsIcon className="w-4 h-4" />
                </a>
              )}
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="TikTok Belezura News"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-none bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6305] transition-colors"
                  aria-label="YouTube Belezura News"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2: Editorias */}
          <div className="lg:col-span-3">
            <p className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305] mb-4">
              Editorias
            </p>
            <ul className="space-y-2.5">
              {CATEGORIES.filter((c) => c.slug !== "/").map((cat) => {
                if (cat.isExternal) {
                  return (
                    <li key={cat.name}>
                      <a
                        href={cat.slug}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span>{cat.name}</span>
                      </a>
                    </li>
                  );
                }
                if (cat.slug.startsWith("#")) {
                  return (
                    <li key={cat.name}>
                      <a
                        href={cat.slug}
                        className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span>{cat.name}</span>
                      </a>
                    </li>
                  );
                }
                return (
                  <li key={cat.slug}>
                    <Link
                      href={cat.slug}
                      className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Coluna 3: CONTATO E PARCERIAS */}
          <div id="contato" className="lg:col-span-5 space-y-4 bg-neutral-900/50 p-6 rounded-none border border-neutral-800/80 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#ff6305]" />
              <p className="font-alleron text-xs font-bold uppercase tracking-widest text-white">
                Parcerias Comerciais & Mídia
              </p>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              Sua marca no radar de quem ama uma novidade de beleza! Conecte-se com uma audiência que respira tendências, testa lançamentos e está sempre de olho no próximo queridinho do mercado.
            </p>

            {/* TEXTO DE CONTATO DESTACADO */}
            <div className="pt-2 text-sm text-neutral-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span>Contato editorial e geral:</span>
              <a
                href={`mailto:${contactEmail}`}
                className="text-[#ff6305] hover:underline font-semibold transition-colors"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior: Copyright & Links Legais */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Belezura News. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/termos-de-uso" className="hover:text-neutral-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-neutral-300 transition-colors">
              Política de Privacidade (LGPD)
            </Link>
            <Link href="/admin" className="hover:text-[#ff6305] transition-colors flex items-center gap-1">
              <span>Acesso CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

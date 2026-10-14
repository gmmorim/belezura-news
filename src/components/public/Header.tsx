"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Mail,
  ArrowRight,
  Lock,
} from "lucide-react";
import { AnimatedHeaderLogo } from "./AnimatedHeaderLogo";
import { CATEGORIES } from "./CategoryNav";
import { NewsletterModal } from "./NewsletterModal";
import { SearchBar } from "./SearchBar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);

  // Data formatada no padrão editorial
  const todayFormatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const capitalizedDate =
    todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <>
      <header className="w-full bg-[#FAF9F6] border-b border-neutral-200/70">
        {/* Barra de Utilidades Editorial Superior */}
        <div className="border-b border-neutral-200/50 text-[11px] sm:text-xs text-neutral-500 font-medium">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            {/* Data e Localização */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff6305] animate-ping" />
              <span className="truncate">{capitalizedDate}</span>
            </div>

            {/* Links rápidos e acesso ao painel */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setNewsletterModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 text-neutral-600 hover:text-[#ff6305] transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#ff6305]" />
                <span>Receba nossa curadoria</span>
              </button>

              <div className="h-3 w-px bg-neutral-200 hidden sm:block" />

              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                title="Área da Redação / Admin"
              >
                <Lock className="w-3 h-3 text-neutral-400" />
                <span className="text-[11px]">Redação</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Área Nobre da Marca (Header Principal) */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5 md:py-7">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Lado Esquerdo: Mobile Trigger & Search Desktop */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 w-10 sm:w-auto">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6305]"
                aria-label="Abrir menu de navegação"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors px-3.5 py-1.5 rounded-full hover:bg-neutral-100 border border-neutral-200/80"
              >
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </div>

            {/* Centro: O Logo Animado da Marca (Recoleta + Alleron com Framer Motion) */}
            <div className="flex-1 flex justify-center text-center px-1 sm:px-2 min-w-0">
              <AnimatedHeaderLogo />
            </div>

            {/* Lado Direito: Ação de Newsletter / Contato Comercial */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-3 shrink-0 w-10 sm:w-auto">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                aria-label="Abrir busca"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href="mailto:comercial@belezuranews.com.br"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-neutral-300/80 text-neutral-800 hover:border-[#ff6305] hover:text-[#ff6305] transition-all duration-200"
              >
                <span>Anuncie</span>
              </a>
            </div>
          </div>

          {/* Barra de Busca Expansível com Live Search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-neutral-200 relative z-30"
              >
                <SearchBar
                  autoFocus
                  onSelectResult={() => setSearchOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Menu Drawer Mobile (Sheet de Navegação com Alta Usabilidade) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop com desfoque */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Painel Lateral Off-Canvas */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
            >
              {/* Topo do Drawer */}
              <div className="p-5 flex items-center justify-between border-b border-neutral-100">
                <span className="font-recoleta text-2xl font-bold text-neutral-950">
                  Belezura <span className="font-alleron text-[#ff6305] text-xl">News</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lista de Categorias com Área de Toque Otimizada (48px+) */}
              <div className="p-4 flex-1 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 px-3 py-2">
                  Editorias
                </div>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-alleron flex items-center justify-between px-3 py-3 rounded-xl text-neutral-800 hover:text-[#ff6305] hover:bg-orange-50/60 font-semibold text-sm uppercase tracking-wider transition-colors active:bg-orange-100"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-300" />
                  </Link>
                ))}

                <div className="pt-4 border-t border-neutral-100 mt-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 px-3">
                    Institucional & Comercial
                  </div>
                  <a
                    href="mailto:comercial@belezuranews.com.br"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-[#ff6305]"
                  >
                    <span>Quer anunciar com a gente?</span>
                    <span className="text-[10px] bg-orange-100 text-[#ff6305] px-2 py-0.5 rounded-full font-bold">Mídia Kit</span>
                  </a>
                  <a
                    href="mailto:contato@belezuranews.com.br"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950"
                  >
                    <span>Fale com a redação</span>
                    <span className="text-[10px] text-neutral-400">Email</span>
                  </a>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Acesso Restrito Redação</span>
                  </Link>
                </div>
              </div>

              {/* Rodapé do Drawer com CTA de Newsletter */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-800 mb-2">
                  Receba o Belezura Drops
                </p>
                <p className="text-[11px] text-neutral-500 mb-3">
                  As principais notícias de beleza, moda e negócios no seu email toda manhã.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setNewsletterModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Cadastrar Gratuitamente</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Inscrição na Newsletter */}
      <NewsletterModal
        isOpen={newsletterModalOpen}
        onClose={() => setNewsletterModalOpen(false)}
      />
    </>
  );
}

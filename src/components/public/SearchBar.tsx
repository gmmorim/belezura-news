"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2, X, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  imageWeb: string;
  createdAt: string;
  category: {
    name: string;
    slug: string;
  };
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSelectResult?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = "Busque por pautas, marcas, tendências ou reviews...",
  className = "",
  onSelectResult,
  autoFocus = false,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fechar popover ao clicar fora do componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fechar com tecla ESC
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Efeito com Debounce (350ms) para busca em tempo real sem sobrecarregar a API
  useEffect(() => {
    const trimmed = searchTerm.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Falha ao buscar matérias:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 350);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    setSearchTerm("");
    if (onSelectResult) {
      onSelectResult();
    }
    router.push(`/post/${slug}`);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-xl mx-auto ${className}`}
      role="search"
    >
      {/* Campo de Entrada de Busca */}
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 w-4 h-4 text-neutral-400 pointer-events-none"
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim().length >= 2) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          className="w-full pl-11 pr-10 py-2.5 bg-white border border-neutral-200/90 rounded-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all shadow-sm"
        />

        {/* Indicador de Carregamento ou Botão Limpar */}
        <div className="absolute right-3.5 flex items-center">
          {isLoading ? (
            <Loader2
              className="w-4 h-4 text-[#ff6305] animate-spin"
              aria-label="Buscando..."
            />
          ) : searchTerm.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Popover Flutuante com Resultados em Tempo Real */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-2.5 z-[99] bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden max-h-[460px] overflow-y-auto overscroll-contain"
          >
            {/* Estado: Carregando Inicial */}
            {isLoading && results.length === 0 && (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2.5">
                <Loader2 className="w-5 h-5 text-[#ff6305] animate-spin" />
                <span className="text-xs font-medium text-neutral-500">
                  Pesquisando pautas na base editorial...
                </span>
              </div>
            )}

            {/* Estado: Nenhum Resultado Encontrado */}
            {!isLoading && hasSearched && results.length === 0 && (
              <div className="p-8 text-center space-y-1.5">
                <p className="text-sm font-semibold text-neutral-800">
                  Nenhuma matéria encontrada
                </p>
                <p className="text-xs text-neutral-500">
                  Não encontramos resultados para &ldquo;{searchTerm}&rdquo;. Tente buscar por outros termos, marcas ou ativos.
                </p>
              </div>
            )}

            {/* Estado: Lista de Resultados */}
            {results.length > 0 && (
              <div className="p-2 divide-y divide-neutral-100">
                <div className="px-3 py-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-alleron">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff6305]" />
                    Resultados encontrados ({results.length})
                  </span>
                  <span className="text-[10px] lowercase text-neutral-400 font-normal">
                    Pressione ESC para fechar
                  </span>
                </div>

                <div className="pt-1 space-y-1">
                  {results.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => handleSelect(post.slug)}
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group cursor-pointer"
                    >
                      {/* Thumbnail Otimizada */}
                      <div className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/60">
                        <img
                          src={post.imageWeb}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Informações da Notícia */}
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-alleron text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-[#ff6305] border border-orange-200/50">
                            {post.category.name}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#ff6305] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h4>

                        {post.subtitle && (
                          <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5 font-light">
                            {post.subtitle}
                          </p>
                        )}
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-[#ff6305] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;

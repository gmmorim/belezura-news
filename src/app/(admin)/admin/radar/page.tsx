"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Radio,
  ExternalLink,
  Copy,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Globe,
} from "lucide-react";
import { RadarNewsItem } from "@/lib/google-news";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { id: "all", label: "Todas as Pautas" },
  { id: "beauty", label: "Beauty" },
  { id: "business", label: "Business" },
  { id: "fashion", label: "Fashion" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "reviews", label: "Reviews" },
];

export default function RadarNewsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<RadarNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (category: string, query = "") => {
    try {
      setLoading(true);
      const url = new URL("/api/radar", window.location.origin);
      if (category !== "all") url.searchParams.set("category", category);
      if (query.trim()) url.searchParams.set("q", query.trim());

      const res = await fetch(url.toString(), {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Falha ao carregar radar:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeed(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFeed(selectedCategory, searchQuery);
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadFeed(selectedCategory, searchQuery);
  };

  // Fluxo de Cópia de Pauta para a esteira editorial
  const handleCopyPautaToPost = (item: RadarNewsItem) => {
    const params = new URLSearchParams({
      title: item.cleanTitle,
      category: item.category,
      sourceUrl: item.sourceUrl,
      sourceName: item.source,
    });
    router.push(`/admin/posts/novo?${params.toString()}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header do Radar com Status ao Vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6305] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6305]" />
            </span>
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Inteligência Editorial ao Vivo
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Radar Google News
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Monitoramento em tempo real dos maiores portais de beleza, negócios e moda. Selecione uma pauta e importe com 1 clique para a redação.
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={loading || refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold transition-all hover:bg-neutral-800 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 text-[#ff6305]", (loading || refreshing) && "animate-spin")} />
          <span>{refreshing ? "Atualizando..." : "Sincronizar Feed"}</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca Responsiva */}
      <div className="space-y-4">
        {/* Scroll horizontal de categorias no mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "font-alleron whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none",
                  isActive
                    ? "bg-[#ff6305] text-white shadow-md shadow-orange-500/20"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Input de Busca Específica por Termo */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por termos específicos (ex: Chanel, protetor, Boticário, IPO)..."
            className="w-full pl-11 pr-24 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 text-xs font-semibold transition-colors"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Grade de Pautas Capturadas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/60 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-20 bg-neutral-800 rounded-full" />
                <div className="h-4 w-16 bg-neutral-800 rounded-md" />
              </div>
              <div className="h-12 bg-neutral-800 rounded-lg" />
              <div className="h-10 bg-neutral-800/60 rounded-lg" />
              <div className="h-10 bg-neutral-800 rounded-xl pt-2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800">
          <Sparkles className="w-8 h-8 text-[#ff6305] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhuma pauta encontrada</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Tente mudar a categoria ou usar outros termos na busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-alleron text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ff6305]/15 text-[#ff6305] border border-[#ff6305]/30">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span>{item.timeAgo}</span>
                  </span>
                </div>

                {/* Título Limpo da Notícia */}
                <h3 className="font-sans font-bold text-base text-white group-hover:text-orange-100 transition-colors leading-snug">
                  {item.cleanTitle}
                </h3>

                {/* Resumo/Snippet */}
                {item.snippet && (
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {item.snippet}
                  </p>
                )}

                {/* Veículo Fonte Original */}
                <div className="pt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                  <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">Fonte: <strong className="text-neutral-300">{item.source}</strong></span>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center gap-2">
                {/* BOTÃO CHAVE: COPIAR PAUTA PARA NOVO POST */}
                <button
                  type="button"
                  onClick={() => handleCopyPautaToPost(item)}
                  className="font-alleron flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/10"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Pauta</span>
                </button>

                {/* Link Externo para ler na íntegra */}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Ler matéria na íntegra no veículo original"
                  aria-label="Abrir link original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

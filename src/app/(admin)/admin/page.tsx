"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Eye,
  Radio,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  BarChart3,
  Award,
  Tag as TagIcon,
  Flame,
  Layers,
  Clock,
  Users,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  views: number;
  publishedAt: string;
}

interface CategoryRank {
  name: string;
  views: number;
  share: number;
}

interface TagRank {
  tag: string;
  count: number;
  views: number;
}

interface ViewsSummary {
  totalPeriod: string;
  changeText: string;
  todayViews: string;
  activeReadersNow: number;
  avgReadTime: string;
  totalLeads: string;
  totalPosts: number;
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [loading, setLoading] = useState(true);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [categoryRanking, setCategoryRanking] = useState<CategoryRank[]>([]);
  const [tagRanking, setTagRanking] = useState<TagRank[]>([]);
  const [viewsSummary, setViewsSummary] = useState<ViewsSummary>({
    totalPeriod: "0",
    changeText: "Sincronizado via banco de dados",
    todayViews: "0",
    activeReadersNow: 0,
    avgReadTime: "3 min",
    totalLeads: "0",
    totalPosts: 0,
  });

  const loadAnalytics = async (selectedPeriod: "week" | "month") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?period=${selectedPeriod}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setTopPosts(data.topPosts || []);
        setCategoryRanking(data.categoryRanking || []);
        setTagRanking(data.tagRanking || []);
        if (data.viewsSummary) {
          setViewsSummary(data.viewsSummary);
        }
      }
    } catch (err) {
      console.error("Falha ao carregar dados de analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics(period);
  }, [period]);

  const maxViews = topPosts.length > 0 ? topPosts[0].views : 1000;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header do Dashboard com Seletor de Período e Ações Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Inteligência de Tráfego & Audiência
            </span>
            <span className="text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {viewsSummary.activeReadersNow} leitores online agora
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Dashboard Editorial & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 self-start sm:self-auto flex-wrap">
          {/* Seletor Temporal: Esta Semana vs Este Mês */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setPeriod("week")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                period === "week"
                  ? "bg-[#ff6305] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Esta Semana
            </button>
            <button
              type="button"
              onClick={() => setPeriod("month")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                period === "month"
                  ? "bg-[#ff6305] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              Este Mês
            </button>
          </div>

          <Link
            href="/admin/radar"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#ff6305]" />
            <span className="hidden xs:inline">Radar</span>
          </Link>

          <Link
            href="/admin/posts/novo"
            className="font-alleron inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Matéria</span>
          </Link>
        </div>
      </div>

      {/* Grade de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Leituras */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-400">
              Total de Visualizações ({period === "week" ? "Semana" : "Mês"})
            </span>
            <div className="p-2 rounded-xl bg-[#ff6305]/10 border border-[#ff6305]/20 text-[#ff6305]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-recoleta text-3xl font-bold text-white tracking-tight">
              {viewsSummary.totalPeriod}
            </p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" />
              <span>{viewsSummary.changeText}</span>
            </p>
          </div>
        </div>

        {/* Leituras Hoje */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-400">Leituras Registradas Hoje</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-recoleta text-3xl font-bold text-white tracking-tight">
              {viewsSummary.todayViews}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Tráfego orgânico e newsletters
            </p>
          </div>
        </div>

        {/* Base de Leads da Newsletter (100% Prisma) */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-400">Base de Leads (Newsletter)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-recoleta text-3xl font-bold text-white tracking-tight">
              {viewsSummary.totalLeads}
            </p>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span>Cadastros ativos no Belezura Drops</span>
            </p>
          </div>
        </div>

        {/* Leitores Ativos em Tempo Real */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-neutral-400">Leitores em Tempo Real</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="font-recoleta text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{viewsSummary.activeReadersNow}</span>
              <span className="text-xs font-sans text-neutral-500 font-normal">ao vivo</span>
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Disparado via sendBeacon
            </p>
          </div>
        </div>
      </div>

      {/* Seção Principal: Top 10 Matérias Mais Lidas & Rankings Laterais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: TOP 10 POSTAGENS MAIS LIDAS (8 Colunas) */}
        <div className="lg:col-span-8 bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ff6305]" />
              <h2 className="font-recoleta text-lg sm:text-xl font-bold text-white">
                Top 10 Postagens Mais Lidas
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#ff6305] uppercase tracking-wider">
              {period === "week" ? "Semanal" : "Mensal"}
            </span>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {topPosts.slice(0, 10).map((post, idx) => {
              const rank = idx + 1;
              const percentOfTop = Math.round((post.views / maxViews) * 100);

              return (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 hover:bg-neutral-800/40 transition-colors group"
                >
                  {/* Número do Ranking */}
                  <div
                    className={cn(
                      "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5",
                      rank === 1
                        ? "bg-[#ff6305] text-white shadow-md shadow-orange-500/20"
                        : rank === 2
                        ? "bg-neutral-800 text-orange-200 border border-neutral-700"
                        : rank === 3
                        ? "bg-neutral-800 text-neutral-300 border border-neutral-700"
                        : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                    )}
                  >
                    #{rank}
                  </div>

                  {/* Informações e Barra de Desempenho Relativo */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-alleron text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {post.category}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Por {post.author} • {post.publishedAt}
                      </span>
                    </div>

                    <h3 className="font-sans text-sm sm:text-base font-semibold text-white leading-snug group-hover:text-[#ff6305] transition-colors line-clamp-2">
                      <Link href={`/noticia/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {/* Barra de Progresso Visual de Visualizações */}
                    <div className="pt-1.5 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-[#ff6305] rounded-full transition-all duration-500"
                          style={{ width: `${percentOfTop}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-200 whitespace-nowrap">
                        {post.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>

                  {/* Ação Rápida */}
                  <Link
                    href={`/noticia/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors shrink-0 hidden sm:block"
                    title="Ver Artigo"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: RANKING DE CATEGORIAS & TAGS (4 Colunas) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Categorias Mais Acessadas */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <Layers className="w-4 h-4 text-[#ff6305]" />
              <h3 className="font-recoleta text-base font-bold text-white">
                Categorias Mais Acessadas
              </h3>
            </div>

            <div className="space-y-3.5">
              {categoryRanking.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-alleron font-bold uppercase tracking-wider text-neutral-200">
                      {cat.name}
                    </span>
                    <span className="text-neutral-400 font-mono">
                      {cat.views.toLocaleString()} views ({cat.share}%)
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        i === 0
                          ? "bg-[#ff6305]"
                          : i === 1
                          ? "bg-orange-400"
                          : i === 2
                          ? "bg-amber-500"
                          : "bg-neutral-600"
                      )}
                      style={{ width: `${cat.share * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Tags Mais Utilizadas na Redação */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <TagIcon className="w-4 h-4 text-[#ff6305]" />
              <h3 className="font-recoleta text-base font-bold text-white">
                Tags Mais Frequentes
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {tagRanking.map((t, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-xs"
                >
                  <span className="font-semibold text-neutral-200">#{t.tag}</span>
                  <span className="text-[10px] bg-neutral-700 text-neutral-400 px-1.5 py-0.2 rounded-md font-mono">
                    {t.count} posts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Boas Práticas de SEO & Google Discover */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/90 rounded-2xl border border-[#ff6305]/20 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#ff6305]">
              <Sparkles className="w-4 h-4" />
              <span className="font-alleron text-xs font-bold uppercase tracking-wider">
                Diretriz Google Discover
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Matérias com imagens horizontais de alta resolução (1600x900) e títulos diretos têm 68% mais chance de aparecer no carrossel de notícias do Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

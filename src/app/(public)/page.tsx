import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, TrendingUp, Clock, Bookmark } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// ============================================================================
// HELPERS DE FORMATAÇÃO EDITORIAL
// ============================================================================
function getReadingTime(content?: string): string {
  if (!content) return "3 min de leitura";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return diffInMinutes <= 5 ? "Agora há pouco" : `Há ${diffInMinutes} min`;
  }
  if (diffInHours < 24) {
    return diffInHours === 1 ? "Há 1 hora" : `Há ${diffInHours} horas`;
  }
  if (diffInDays === 1) {
    return "Ontem";
  }
  if (diffInDays < 7) {
    return `Há ${diffInDays} dias`;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getCategoryBadgeColor(categorySlug?: string): string {
  switch (categorySlug?.toLowerCase()) {
    case "beauty":
      return "bg-[#ff6305] text-white";
    case "business":
      return "bg-neutral-900 text-white";
    case "fashion":
      return "bg-rose-700 text-white";
    case "lifestyle":
      return "bg-purple-800 text-white";
    case "reviews":
      return "bg-emerald-700 text-white";
    default:
      return "bg-neutral-800 text-white";
  }
}

// ============================================================================
// SERVER COMPONENT PRINCIPAL DA HOME PAGE
// ============================================================================
export default async function HomePage() {
  // 1. Capa da Semana (Hero): O post publicado mais recente
  const heroPost = await prisma.post.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: true,
    },
  });

  // 2. Mais Lidas da Semana: Ordenadas pelo número de views (decrescente)
  const mostReadPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: 4,
    include: {
      category: true,
      author: true,
    },
  });

  // 3. Radar Belezura / Últimas Pautas: Ordenadas por data de criação
  const latestPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true,
      author: true,
    },
  });

  // Se o banco estiver completamente vazio (0 posts cadastrados)
  if (!heroPost) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#ff6305] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-neutral-900">
            Nenhuma publicação no momento
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Nossa redação está a preparar novas pautas e coberturas exclusivas de beleza, moda e mercado. Fique atento às próximas atualizações!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* SEÇÃO HERO EDITORIAL: CAPA DA SEMANA + MAIS LIDAS                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          
          {/* Matéria de Capa Principal (8 Colunas no Desktop) */}
          <div className="w-full lg:col-span-8 group cursor-pointer">
            <Link
              href={`/post/${heroPost.slug}`}
              className="block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] flex flex-col justify-end"
            >
              {/* Background com imagem dinâmica do Prisma */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url('${heroPost.imageWeb}')`,
                }}
              />
              {/* Gradiente escuro para legibilidade máxima do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

              {/* Badges de Contexto no Topo */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10 flex-wrap">
                <span className="font-alleron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-md">
                  {heroPost.category?.name || "Editorial"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  Capa da Semana
                </span>
              </div>

              {/* Informações da Notícia */}
              <div className="relative z-10 p-5 sm:p-7 md:p-8 text-white w-full space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
                  <span>Por {heroPost.author?.name || "Redação Belezura"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ff6305]" />
                    {getReadingTime(heroPost.content)}
                  </span>
                </div>

                {/* Título Responsivo */}
                <h1 className="font-recoleta text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-snug sm:leading-tight break-words group-hover:text-orange-200 transition-colors">
                  {heroPost.title}
                </h1>

                {/* Subtítulo / Linha fina */}
                {heroPost.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-neutral-200 line-clamp-2 max-w-2xl font-light leading-relaxed break-words">
                    {heroPost.subtitle}
                  </p>
                )}
              </div>
            </Link>

            {/* Crédito obrigatório de fonte abaixo da imagem */}
            <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1.5 px-1">
              <span className="font-semibold text-neutral-400">Fonte:</span>
              <a
                href={heroPost.imageSourceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 decoration-neutral-300 hover:decoration-[#ff6305] transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>{heroPost.imageSourceText || "Divulgação / Editorial"}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Coluna Lateral: Mais Lidas da Semana (4 Colunas no Desktop) */}
          <div className="w-full lg:col-span-4 flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ff6305]" />
                <h2 className="font-alleron text-xs font-bold uppercase tracking-widest text-neutral-900">
                  Mais Lidas da Semana
                </h2>
              </div>
              <span className="text-[11px] font-bold text-[#ff6305] uppercase tracking-wider">
                Em Alta
              </span>
            </div>

            {/* Lista Real de Matérias Ordenadas por Views */}
            {mostReadPosts.length > 0 ? (
              mostReadPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/post/${item.slug}`}
                  className="block w-full p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#ff6305]/40 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-alleron text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryBadgeColor(
                        item.category?.slug
                      )}`}
                    >
                      {item.category?.name || "Editorial"}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                    {item.title}
                  </h3>
                </Link>
              ))
            ) : (
              <p className="text-xs text-neutral-400 p-4">
                Sem matérias adicionais nas mais lidas no momento.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GRID DE NOVIDADES EDITORIAL: ÚLTIMAS PAUTAS & TENDÊNCIAS          */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-white py-12 sm:py-16 border-t border-neutral-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#ff6305]" />
                <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
                  Radar Belezura
                </span>
              </div>
              <h2 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight break-words">
                Últimas Pautas & Tendências
              </h2>
            </div>
            <Link
              href="/radar"
              className="font-alleron inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-[#ff6305] transition-colors group self-start sm:self-auto"
            >
              <span>Ver feed completo</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards Dinâmicos com Dados Reais do Banco de Dados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {latestPosts.map((card) => (
              <article
                key={card.id}
                className="w-full group flex flex-col bg-[#FAF9F6] rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all duration-300"
              >
                <Link
                  href={`/post/${card.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${card.imageWeb}')` }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-alleron px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 shadow-sm backdrop-blur-md">
                      {card.category?.name || "Geral"}
                    </span>
                  </div>
                </Link>

                {/* Crédito obrigatório de fonte abaixo da imagem */}
                <div className="px-5 pt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
                  <span className="text-neutral-400">Fonte:</span>
                  <a
                    href={card.imageSourceUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
                  >
                    <span>{card.imageSourceText || "Divulgação / Editorial"}</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium mb-2 flex items-center justify-between">
                      <span>{card.author?.name || "Redação Belezura"}</span>
                      <span>{formatDate(card.createdAt)}</span>
                    </div>
                    <h3 className="font-recoleta text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                      <Link href={`/post/${card.slug}`}>
                        {card.title}
                      </Link>
                    </h3>
                    {card.subtitle && (
                      <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed break-words font-light">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between">
                    <Link
                      href={`/post/${card.slug}`}
                      className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ler matéria completa <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      aria-label="Salvar notícia"
                      className="text-neutral-400 hover:text-neutral-900 p-1 rounded-full hover:bg-neutral-200/50 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

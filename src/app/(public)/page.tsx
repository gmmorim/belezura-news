import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Clock, Bookmark, MessageSquareQuote } from "lucide-react";
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

// ============================================================================
// SERVER COMPONENT PRINCIPAL DA HOME PAGE
// ============================================================================
export default async function HomePage() {
  // 1. Top 3 Matérias Publicadas para o Novo Grid Hero Editorial
  const topPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      category: true,
      author: true,
    },
  });

  const heroPost = topPosts[0];
  const sideHeroPosts = topPosts.slice(1, 3);

  // 2. Seção "BLZURA Entrevistas": Matérias de entrevistas / grandes reportagens
  let interviewPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { category: { slug: "entrevistas" } },
        { category: { slug: "business" } },
        { category: { slug: "lifestyle" } },
        { title: { contains: "entrevista" } },
        { subtitle: { contains: "entrevista" } },
      ],
    },
    orderBy: { views: "desc" },
    take: 3,
    include: {
      category: true,
      author: true,
    },
  });

  // Fallback caso não haja matérias com essas tags/categorias específicas
  if (interviewPosts.length === 0) {
    interviewPosts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { views: "desc" },
      take: 3,
      include: {
        category: true,
        author: true,
      },
    });
  }

  // 3. Seção "BLZURA News": Últimas Pautas & Tendências (exclui o Hero se possível)
  const blzuraNewsPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    skip: topPosts.length >= 3 ? 3 : 0,
    take: 6,
    include: {
      category: true,
      author: true,
    },
  });

  // Fallback se o total de posts for pequeno
  const newsPostsToDisplay = blzuraNewsPosts.length > 0 ? blzuraNewsPosts : topPosts;

  // Se o banco estiver completamente vazio (0 posts cadastrados)
  if (!heroPost) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-none bg-orange-50 text-[#ff6305] flex items-center justify-center mx-auto border border-[#ff6305]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-normal text-neutral-900">
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
      {/* SEÇÃO HERO EDITORIAL: 3 MATÉRIAS (8 COLUNAS + 4 COLUNAS STACKED)   */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
          
          {/* Lado Esquerdo: Matéria de Capa Principal (8 Colunas no Desktop) */}
          <div className="w-full lg:col-span-8 group cursor-pointer flex flex-col">
            <Link
              href={`/post/${heroPost.slug}`}
              className="block relative w-full rounded-none overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] flex-1 flex flex-col justify-end"
            >
              {/* Imagem de Fundo com Zoom Suave */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url('${heroPost.imageWeb}')`,
                }}
              />
              {/* Gradiente Editorial Escuro para Legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

              {/* Badges de Contexto com Cantos Vivos (rounded-none) */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10 flex-wrap">
                <span className="font-alleron px-3 py-1 rounded-none text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-md">
                  {heroPost.category?.name || "Editorial"}
                </span>
                <span className="font-alleron px-3 py-1 rounded-none text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 uppercase tracking-wider">
                  Capa da Semana
                </span>
              </div>

              {/* Informações da Matéria */}
              <div className="relative z-10 p-5 sm:p-7 md:p-8 text-white w-full space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
                  <span>Por {heroPost.author?.name || "Redação Belezura"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ff6305]" />
                    {getReadingTime(heroPost.content)}
                  </span>
                </div>

                {/* Título Principal */}
                <h1 className="font-recoleta text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-snug sm:leading-tight break-words group-hover:text-orange-200 transition-colors">
                  {heroPost.title}
                </h1>

                {/* Subtítulo / Linha Fina */}
                {heroPost.subtitle && (
                  <p className="text-xs sm:text-sm md:text-base text-neutral-200 line-clamp-2 max-w-2xl font-light leading-relaxed break-words">
                    {heroPost.subtitle}
                  </p>
                )}
              </div>
            </Link>

            {/* Crédito obrigatório de fonte */}
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

          {/* Lado Direito: 2 Matérias Menores Empilhadas Verticalmente (4 Colunas) */}
          <div className="w-full lg:col-span-4 flex flex-col gap-6 justify-between">
            {sideHeroPosts.length > 0 ? (
              sideHeroPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col bg-white border border-neutral-200/90 rounded-none overflow-hidden hover:border-[#ff6305]/60 hover:shadow-md transition-all duration-300 flex-1"
                >
                  <Link
                    href={`/post/${post.slug}`}
                    className="block relative aspect-[16/9] w-full overflow-hidden bg-neutral-100"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${post.imageWeb}')` }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="font-alleron px-2.5 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider bg-black/85 text-white backdrop-blur-sm">
                        {post.category?.name || "Editorial"}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Clock className="w-3 h-3 text-[#ff6305]" />
                          {getReadingTime(post.content)}
                        </span>
                        <span>{formatRelativeTime(post.createdAt)}</span>
                      </div>

                      <h2 className="font-recoleta text-lg sm:text-xl font-normal text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                        <Link href={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {post.subtitle && (
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
                          {post.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/post/${post.slug}`}
                        className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Ler matéria</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                      <span className="text-[10px] text-neutral-400">
                        {post.author?.name || "Redação"}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-none text-neutral-400 text-xs">
                Aguardando novas pautas para a capa.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SEÇÃO INÉDITA: BLZURA ENTREVISTAS (ALTO CONTRASTE EDITORIAL)       */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-[#0d0f14] py-16 sm:py-20 border-t border-neutral-800 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4 border-b border-neutral-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareQuote className="w-4 h-4 text-[#ff6305]" />
                <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
                  BLZURA Entrevistas
                </span>
              </div>
              <h2 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight break-words">
                Grandes Conversas & Bastidores
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-xl font-light">
                Diálogos com mentes inovadoras, criadores e executivos que definem os rumos da beleza e da moda.
              </p>
            </div>
          </div>

          {/* Grid de Entrevistas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {interviewPosts.map((interview) => (
              <article
                key={interview.id}
                className="w-full group flex flex-col bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden hover:border-[#ff6305]/60 transition-all duration-300"
              >
                <Link
                  href={`/post/${interview.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-950"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${interview.imageWeb}')` }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-alleron px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider bg-[#ff6305] text-white">
                      Entrevista
                    </span>
                  </div>
                </Link>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium mb-2.5 flex items-center justify-between">
                      <span>Por {interview.author?.name || "Redação Belezura"}</span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3 h-3 text-[#ff6305]" />
                        {getReadingTime(interview.content)}
                      </span>
                    </div>

                    <h3 className="font-recoleta text-lg sm:text-xl font-normal text-white group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                      <Link href={`/post/${interview.slug}`}>
                        {interview.title}
                      </Link>
                    </h3>

                    {interview.subtitle && (
                      <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed font-light">
                        {interview.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-5 border-t border-neutral-800 flex items-center justify-between">
                    <Link
                      href={`/post/${interview.slug}`}
                      className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ler entrevista <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      {formatDate(interview.createdAt)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SEÇÃO BLZURA NEWS (ANTIGO RADAR): ÚLTIMAS PAUTAS & TENDÊNCIAS     */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-white py-14 sm:py-20 border-t border-neutral-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#ff6305]" />
                <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
                  BLZURA News
                </span>
              </div>
              <h2 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-950 tracking-tight break-words">
                Últimas Pautas & Tendências
              </h2>
            </div>
            <Link
              href="/beauty"
              className="font-alleron inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-[#ff6305] transition-colors group self-start sm:self-auto"
            >
              <span>Ver feed completo</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards Dinâmicos com Estilo Editorial e Cantos Vivos (rounded-none) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {newsPostsToDisplay.map((card) => (
              <article
                key={card.id}
                className="w-full group flex flex-col bg-[#FAF9F6] rounded-none overflow-hidden border border-neutral-200/80 hover:border-[#ff6305]/50 hover:shadow-lg transition-all duration-300"
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
                    <span className="font-alleron px-3 py-1 rounded-none text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 border border-neutral-200 shadow-sm backdrop-blur-md">
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
                    <h3 className="font-recoleta text-lg sm:text-xl font-normal text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
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
                      className="text-neutral-400 hover:text-neutral-900 p-1 rounded-none hover:bg-neutral-200/50 transition-colors"
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

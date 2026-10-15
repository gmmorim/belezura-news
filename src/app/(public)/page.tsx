import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Clock, Bookmark, MessageSquareQuote } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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

  // 3. Seção "BLZURA News": Últimas Pautas & Tendências (6 matérias para grid 2x3 no desktop)
  const blzuraNewsPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
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
          <h1 className="font-recoleta text-2xl sm:text-3xl font-normal text-black">
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
      {/* SEÇÃO HERO EDITORIAL: 3 MATÉRIAS (8 COLS DESTAQUE + 4 COLS STACK)   */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full">
          
          {/* Lado Esquerdo: Matéria de Capa Principal (8 Colunas no Desktop) */}
          <article className="w-full lg:col-span-8 group cursor-pointer flex flex-col items-start text-left">
            {/* 1. Imagem no Topo limpa com aspect-video travado */}
            <Link
              href={`/post/${heroPost.slug}`}
              className="block relative w-full aspect-video overflow-hidden bg-neutral-100 rounded-none border border-neutral-200/80 shadow-sm"
            >
              <img
                src={heroPost.imageWeb}
                alt={heroPost.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Link>

            {/* Crédito obrigatório de fonte */}
            <div className="mt-1.5 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
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

            {/* 2. Categoria em Destaque (abaixo da imagem, uppercase, font-bold, text-[#ff6305]) */}
            <div className="mt-4 flex items-center gap-2">
              <span className="font-alleron text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ff6305]">
                {heroPost.category?.name || "Editorial"}
              </span>
              <span className="text-neutral-300">•</span>
              <span className="font-alleron text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Capa da Semana
              </span>
            </div>

            {/* 3. Título / Manchete (texto preto, font-recoleta, text-2xl a text-5xl) */}
            <h1 className="mt-2 font-recoleta text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-black group-hover:text-[#ff6305] transition-colors leading-[1.15] tracking-tight">
              <Link href={`/post/${heroPost.slug}`}>
                {heroPost.title}
              </Link>
            </h1>

            {/* Subtítulo / Linha Fina */}
            {heroPost.subtitle && (
              <p className="mt-3 text-sm sm:text-base text-neutral-600 line-clamp-3 font-light leading-relaxed">
                {heroPost.subtitle}
              </p>
            )}

            {/* Metadados de Autor, Tempo de Leitura e Data */}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-3 text-xs text-neutral-400 font-medium w-full">
              <span>Por {heroPost.author?.name || "Redação Belezura"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#ff6305]" />
                {getReadingTime(heroPost.content)}
              </span>
              <span>•</span>
              <span>{formatRelativeTime(heroPost.createdAt)}</span>
            </div>
          </article>

          {/* Lado Direito: 2 Matérias Menores Empilhadas Verticalmente (4 Colunas) */}
          <div className="w-full lg:col-span-4 flex flex-col justify-between h-full gap-8 lg:gap-0">
            {sideHeroPosts.length > 0 ? (
              sideHeroPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col items-start text-left"
                >
                  {/* 1. Imagem no Topo limpa travada em aspect-video */}
                  <Link
                    href={`/post/${post.slug}`}
                    className="block relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-none border border-neutral-200/80 shadow-sm"
                  >
                    <img
                      src={post.imageWeb}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {/* 2. Categoria em Destaque */}
                  <span className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] block mt-2.5">
                    {post.category?.name || "Editorial"}
                  </span>

                  {/* 3. Título / Manchete */}
                  <h2 className="mt-1.5 font-recoleta text-lg sm:text-xl font-normal text-black group-hover:text-[#ff6305] transition-colors leading-snug">
                    <Link href={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* 4. Subtítulo / Linha Fina (Preenche o espaço com line-clamp para controle rigoroso de altura) */}
                  {post.subtitle && (
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 font-light leading-relaxed">
                      {post.subtitle}
                    </p>
                  )}
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
      {/* SEÇÃO BLZURA ENTREVISTAS (ALTO CONTRASTE EDITORIAL)                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-[#0d0f14] py-16 sm:py-20 border-t border-neutral-800 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4 border-b border-neutral-800 pb-6 text-left">
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

          {/* Grid de Entrevistas no Padrão Editorial Empilhado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {interviewPosts.map((interview) => (
              <article
                key={interview.id}
                className="w-full group flex flex-col items-start text-left bg-neutral-900/60 p-5 border border-neutral-800 rounded-none hover:border-[#ff6305]/60 transition-all duration-300"
              >
                {/* 1. Imagem no Topo limpa */}
                <Link
                  href={`/post/${interview.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-950 rounded-none border border-neutral-800"
                >
                  <img
                    src={interview.imageWeb}
                    alt={interview.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Crédito */}
                <div className="mt-1.5 text-[10px] text-neutral-500 flex items-center gap-1">
                  <span>Fonte:</span>
                  <span className="text-neutral-400 truncate">{interview.imageSourceText || "Editorial"}</span>
                </div>

                {/* 2. Categoria em Destaque */}
                <span className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] block mt-3">
                  {interview.category?.name || "Entrevista"}
                </span>

                {/* 3. Título / Manchete */}
                <h3 className="mt-1.5 font-recoleta text-lg sm:text-xl font-normal text-white group-hover:text-[#ff6305] transition-colors leading-snug">
                  <Link href={`/post/${interview.slug}`}>
                    {interview.title}
                  </Link>
                </h3>

                {interview.subtitle && (
                  <p className="mt-2 text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed font-light">
                    {interview.subtitle}
                  </p>
                )}

                <div className="pt-3 mt-4 border-t border-neutral-800 flex items-center justify-between w-full text-[11px] text-neutral-400">
                  <Link
                    href={`/post/${interview.slug}`}
                    className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ler entrevista</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <span>{formatDate(interview.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SEÇÃO BLZURA NEWS: ÚLTIMAS PAUTAS & TENDÊNCIAS                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full bg-white py-14 sm:py-20 border-t border-neutral-200/80">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12 border-b border-neutral-200 pb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#ff6305]" />
              <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
                BLZURA News
              </span>
            </div>
            <h2 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-normal text-black tracking-tight break-words">
              Últimas Pautas & Tendências
            </h2>
          </div>

          {/* Cards Dinâmicos com Estilo Editorial Empilhado Verticalmente */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 w-full">
            {newsPostsToDisplay.map((card) => (
              <article
                key={card.id}
                className="w-full group flex flex-col items-start text-left bg-white border border-neutral-200/80 p-5 rounded-none hover:border-[#ff6305]/60 hover:shadow-lg transition-all duration-300"
              >
                {/* 1. Imagem no Topo limpa (sem badge por cima, sem overlay) */}
                <Link
                  href={`/post/${card.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 rounded-none border border-neutral-200/60"
                >
                  <img
                    src={card.imageWeb}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Crédito obrigatório de fonte abaixo da imagem */}
                <div className="mt-1.5 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
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

                {/* 2. Categoria em Destaque (abaixo da imagem, uppercase, font-bold, text-[#ff6305]) */}
                <span className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] block mt-3">
                  {card.category?.name || "Geral"}
                </span>

                {/* 3. Título / Manchete (texto preto, font-recoleta text-lg sm:text-xl) */}
                <h3 className="mt-1.5 font-recoleta text-lg sm:text-xl font-normal text-black group-hover:text-[#ff6305] transition-colors leading-snug">
                  <Link href={`/post/${card.slug}`}>
                    {card.title}
                  </Link>
                </h3>

                {/* Subtítulo */}
                {card.subtitle && (
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-light">
                    {card.subtitle}
                  </p>
                )}

                {/* Metadados e CTA */}
                <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between w-full">
                  <Link
                    href={`/post/${card.slug}`}
                    className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ler matéria completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    aria-label="Salvar notícia"
                    className="text-neutral-400 hover:text-black p-1 rounded-none hover:bg-neutral-100 transition-colors"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Botão Grande e Centralizado: Ver Mais Matérias */}
          <div className="mt-12 sm:mt-16 flex justify-center w-full">
            <Link
              href="/feed"
              className="font-alleron inline-flex items-center justify-center gap-2.5 px-10 sm:px-14 py-4 sm:py-4.5 bg-[#ff6305] text-white text-sm sm:text-base font-bold uppercase tracking-widest rounded-none hover:bg-orange-600 active:scale-[0.99] transition-all shadow-md shadow-orange-500/20"
            >
              <span>Ver mais matérias</span>
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

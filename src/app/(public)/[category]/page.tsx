import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CategoryMeta {
  title: string;
  tagline: string;
  badge: string;
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  beauty: {
    title: "Beauty & Skincare",
    tagline: "As novidades, ativos botânicos e rituais que estão moldando o cuidado contemporâneo.",
    badge: "Beleza de Prestígio",
  },
  fashion: {
    title: "Fashion & Estilo",
    tagline: "Desfiles internacionais, tendências de passarela e a nova alfaiataria utilitária.",
    badge: "Moda & Passarela",
  },
  business: {
    title: "Business & Mercado",
    tagline: "Movimentações corporativas, fusões, aquisições e o faturamento do mercado de luxo.",
    badge: "Mercado & Finanças",
  },
  lifestyle: {
    title: "Lifestyle & Bem-Estar",
    tagline: "Retiros de longevidade, rotinas saudáveis e experiências de consumo conscientes.",
    badge: "Vida & Equilíbrio",
  },
  reviews: {
    title: "Reviews Sinceros",
    tagline: "Testes laboratoriais e opiniões sem filtro sobre os lançamentos mais comentados.",
    badge: "Bancada de Testes",
  },
  radar: {
    title: "Radar Belezura News",
    tagline: "A esteira em tempo real das pautas mais quentes da internet curadas pela nossa redação.",
    badge: "Trending Feed",
  },
};

function getReadingTime(content?: string): string {
  if (!content) return "3 min";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function CategoryFeedPage({
  params,
}: {
  params: { category: string };
}) {
  const catKey = params.category.toLowerCase();
  const meta = CATEGORY_MAP[catKey];

  if (!meta) {
    notFound();
  }

  // Busca posts reais no banco de dados Prisma
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      ...(catKey !== "radar"
        ? {
            category: {
              slug: catKey,
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      author: true,
    },
  });

  return (
    <div className="w-full pb-20">
      {/* Banner da Categoria */}
      <section className="bg-white border-b border-neutral-200/80 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <span className="font-alleron inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-orange-50 text-[#ff6305] border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{meta.badge}</span>
            </span>

            <h1 className="font-recoleta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
              {meta.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              {meta.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Grid de Notícias da Categoria */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all duration-300"
              >
                {/* Imagem do Card */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${post.imageWeb}')` }}
                  />
                </div>

                {/* Crédito obrigatório de fonte abaixo da imagem */}
                <div className="px-5 pt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
                  <span className="text-neutral-400">Fonte:</span>
                  <a
                    href={post.imageSourceUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
                  >
                    <span>{post.imageSourceText || "Divulgação / Editorial"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Informações da Notícia */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium mb-2 flex items-center justify-between">
                      <span>{post.author?.name || "Redação Belezura"}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>

                    <h3 className="font-recoleta text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug">
                      <Link href={`/post/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {post.subtitle && (
                      <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-light">
                        {post.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                    <Link
                      href={`/post/${post.slug}`}
                      className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Ler matéria completa</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-neutral-400">
                      {getReadingTime(post.content)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto space-y-3">
            <p className="text-base font-semibold text-neutral-800">
              Nenhuma matéria publicada nesta editoria ainda
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Estamos a apurar pautas exclusivas para {meta.title}. Volte em breve ou explore a capa principal.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff6305] transition-colors"
              >
                Voltar à Capa
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

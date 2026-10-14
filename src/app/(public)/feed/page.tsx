import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Feed Geral de Notícias | Belezura News",
  description: "Acompanhe todas as matérias, análises, entrevistas e tendências publicadas pela redação Belezura News.",
};

function getReadingTime(content?: string): string {
  if (!content) return "3 min";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min de leitura`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function FeedPage() {
  // Busca todas as matérias publicadas no portal, ordenadas pela data de criação decrescente
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      author: true,
    },
  });

  return (
    <div className="w-full pb-20">
      {/* Banner Superior Editorial do Feed Geral */}
      <section className="bg-white border-b border-neutral-200/80 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="font-alleron inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold uppercase tracking-widest bg-orange-50 text-[#ff6305] border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Feed Editorial Geral</span>
            </span>

            <h1 className="font-recoleta text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-950">
              Todas as Matérias
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
              Acompanhe a cobertura integral de beleza, moda, tendências, comportamento e mercado da redação Belezura News.
            </p>

            <div className="pt-1">
              <span className="text-xs font-medium text-neutral-400">
                {posts.length} {posts.length === 1 ? "matéria publicada" : "matérias publicadas"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Notícias Editorial: 3 Colunas no Desktop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col items-start text-left bg-white p-5 rounded-none border border-neutral-200/80 hover:border-[#ff6305]/60 hover:shadow-lg transition-all duration-300"
              >
                {/* 1. Imagem no Topo limpa travada em aspect-video com rounded-none */}
                <Link
                  href={`/post/${post.slug}`}
                  className="block relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-none border border-neutral-200/60"
                >
                  <img
                    src={post.imageWeb}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </Link>

                {/* Crédito de fonte obrigatório abaixo da imagem */}
                {post.imageSourceText && (
                  <div className="mt-1.5 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
                    <span className="text-neutral-400">Fonte:</span>
                    <a
                      href={post.imageSourceUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
                    >
                      <span>{post.imageSourceText}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}

                {/* 2. Categoria em Destaque (uppercase, font-bold, text-[#ff6305]) */}
                <span className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] block mt-3">
                  {post.category?.name || "Geral"}
                </span>

                {/* 3. Título / Manchete (font-recoleta text-xl sm:text-2xl) */}
                <h2 className="mt-1.5 font-recoleta text-xl sm:text-2xl font-normal text-black group-hover:text-[#ff6305] transition-colors leading-snug">
                  <Link href={`/post/${post.slug}`}>{post.title}</Link>
                </h2>

                {/* 4. Subtítulo / Linha Fina com line-clamp */}
                {post.subtitle && (
                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed font-light">
                    {post.subtitle}
                  </p>
                )}

                {/* Metadados e CTA */}
                <div className="pt-4 mt-auto border-t border-neutral-100 flex items-center justify-between w-full">
                  <Link
                    href={`/post/${post.slug}`}
                    className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ler matéria completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#ff6305]" />
                      {getReadingTime(post.content)}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-none bg-orange-50 text-[#ff6305] flex items-center justify-center mx-auto border border-[#ff6305]/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-recoleta text-2xl font-normal text-black">
              Nenhuma matéria publicada ainda
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed font-light">
              Nossa redação está a preparar novas pautas e coberturas exclusivas. Volte em breve para conferir!
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="font-alleron inline-flex items-center gap-2 px-6 py-2.5 rounded-none bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ff6305] transition-colors"
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

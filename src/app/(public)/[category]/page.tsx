import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowUpRight, Sparkles, ExternalLink } from "lucide-react";

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

const CATEGORY_POSTS = [
  {
    slug: "minimalismo-botanico-skincare-luxo",
    title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.",
    desc: "Laboratórios europeus apostam na extração celular a frio de orquídeas e resinas raras.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    sourceText: "Getty Images",
    sourceUrl: "https://www.gettyimages.com",
    author: "Helena Castro",
    date: "13 Out 2026",
    readTime: "4 min",
  },
  {
    slug: "fusoes-gigantes-cosmeticos-brasil",
    title: "Marcas independentes de perfume autoral crescem 42% no Brasil desafiando gigantes.",
    desc: "Consumidores buscam acordes raros da Amazônia e identidade olfativa customizada.",
    img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    sourceText: "Unsplash / Studio",
    sourceUrl: "https://unsplash.com",
    author: "Lucas Ferreira",
    date: "12 Out 2026",
    readTime: "5 min",
  },
  {
    slug: "rotina-matinal-fundadoras-startups",
    title: "Os 5 tratamentos dermatológicos não invasivos mais procurados desta temporada.",
    desc: "Ultrassom microfocado e bioestimuladores sem downtime lideram clínicas no país.",
    img: "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=800&auto=format&fit=crop",
    sourceText: "Reprodução / Vogue",
    sourceUrl: "https://vogue.globo.com",
    author: "Mariana Costa",
    date: "11 Out 2026",
    readTime: "3 min",
  },
];

export default function CategoryFeedPage({
  params,
}: {
  params: { category: string };
}) {
  const catKey = params.category.toLowerCase();
  const meta = CATEGORY_MAP[catKey];

  if (!meta) {
    notFound();
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORY_POSTS.map((post, idx) => (
            <article
              key={idx}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all duration-300"
            >
              {/* Imagem do Card */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${post.img}')` }}
                />
              </div>

              {/* REGRA OBRIGATÓRIA: EMBAIXO DE TODA IMAGEM DEVE TER UM 'Fonte: (hyperlink)' EM LETRAS BEM MENORES MAS LEGÍVEIS */}
              <div className="px-5 pt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
                <span className="text-neutral-400">Fonte:</span>
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
                >
                  <span>{post.sourceText}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Informações da Notícia */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium mb-2 flex items-center justify-between">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-recoleta text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug">
                    <Link href={`/noticia/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                    {post.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/noticia/${post.slug}`}
                    className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ler matéria completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-neutral-400">{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Calendar,
  Share2,
  Bookmark,
  ExternalLink,
  Tag as TagIcon,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ViewTracker } from "@/components/analytics/ViewTracker";

// Mock de base de dados para matérias completas
const POSTS_DATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    category: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: string;
    imageWeb: string;
    imageMobile: string;
    imageSourceText: string;
    imageSourceUrl: string;
    content: string[];
    tags: string[];
  }
> = {
  "minimalismo-botanico-skincare-luxo": {
    title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.",
    subtitle:
      "Como marcas consolidadas e laboratórios franceses estão resgatando ativos naturais para criar fórmulas ultraconcentradas que dispensam rotinas de 10 passos.",
    category: "Beauty",
    author: "Helena Castro",
    authorRole: "Editora-Chefe de Beleza",
    date: "13 de Outubro de 2026",
    readTime: "4 min de leitura",
    imageWeb:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop",
    imageMobile:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    imageSourceText: "Getty Images / Studio Editorial Paris",
    imageSourceUrl: "https://www.gettyimages.com",
    content: [
      "Durante quase uma década, a indústria cosmética convenceu o consumidor de que uma pele radiante exigia paciência para cumprir rituais extensos de múltiplos passos. No entanto, uma transformação silenciosa iniciada em laboratórios europeus acaba de desembarcar com força no mercado brasileiro: o minimalismo botânico de alta precisão.",
      "Em vez de sobreposições de ácidos agressivos e espessantes sintéticos, a nova geração de formulações recorre a tecnologias de extração celular a frio. Isso permite concentrar fitonutrientes em moléculas biocompatíveis que a epiderme absorve quase instantaneamente, dispensando o uso de emulsões pesadas.",
      "O grande protagonista da temporada é o extrato concentrado de orquídeas alpinas e resinas amazônicas purificadas. Estudos clínicos recentes apontam um estímulo de 300% na síntese natural de ceramidas e barreira lipídica em apenas 14 dias de uso contínuo.",
      "Para os dermatologistas, o movimento é mais do que bem-vindo. 'Vimos uma explosão de peles sensibilizadas pelo excesso de produtos incompatíveis. A volta ao essencial com formulações biocompatíveis de alta pureza entrega viço e acalma a barreira cutânea sem sobrecarregar os poros', explica a dermatologista dra. Fernanda Brandão.",
      "Marcas globais de nicho e conglomerados de luxo já estão reformulando suas linhas para atender a esse novo perfil de consumidor: alguém que busca eficácia comprovada, estética limpa e respeito ao tempo.",
    ],
    tags: ["skincare", "botanica", "luxo", "beleza-limpa", "tendencias"],
  },
  "fusoes-gigantes-cosmeticos-brasil": {
    title: "Fusões milionárias: gigantes de cosméticos aceleram aquisições no Brasil.",
    subtitle:
      "Movimentos estratégicos mostram apetite recorde de conglomerados internacionais por marcas autorais brasileiras.",
    category: "Business",
    author: "Lucas Ferreira",
    authorRole: "Repórter de Mercado & Negócios",
    date: "13 de Outubro de 2026",
    readTime: "5 min de leitura",
    imageWeb:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop",
    imageMobile:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    imageSourceText: "Bloomberg / Financial Archives",
    imageSourceUrl: "https://www.bloomberg.com",
    content: [
      "O mercado brasileiro de beleza e higiene pessoal voltou a ocupar o topo da lista de prioridades dos fundos de private equity e das multinacionais do setor. Nas últimas três semanas, duas transações de grande porte movimentaram os bastidores do varejo de prestígio.",
      "O interesse é impulsionado pela maturidade digital das marcas locais nativas da internet (DNVBs), que construíram comunidades fiéis e possuem margens operacionais atraentes comparadas às marcas tradicionais de farmácia.",
      "Com o fortalecimento da exportação de cosméticos com ingredientes da biodiversidade nacional para o mercado asiático e norte-americano, os analistas preveem que a onda de aquisições deve se estender por todo o próximo trimestre.",
    ],
    tags: ["business", "mercado", "aquisicoes", "luxo", "economia"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = POSTS_DATA[params.slug] || POSTS_DATA["minimalismo-botanico-skincare-luxo"];

  if (!post) {
    return {
      title: "Matéria não encontrada | Belezura News",
      description: "A matéria solicitada não existe ou foi removida.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.com.br";
  const postUrl = `${siteUrl}/noticia/${params.slug}`;

  return {
    title: `${post.title} | Belezura News`,
    description: post.subtitle,
    alternates: {
      canonical: postUrl,
    },
    authors: [{ name: post.author }],
    category: post.category,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      url: postUrl,
      siteName: "Belezura News",
      locale: "pt_BR",
      type: "article",
      publishedTime: "2026-10-13T14:00:00Z",
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.imageWeb,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
      images: [post.imageWeb],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Busca a matéria por slug ou usa a matéria de destaque como fallback para demonstração
  const post =
    POSTS_DATA[params.slug] || POSTS_DATA["minimalismo-botanico-skincare-luxo"];

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.com.br";
  const postUrl = `${siteUrl}/noticia/${params.slug}`;

  // Estrutura de dados Schema.org NewsArticle (Google News & Discover)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.subtitle,
    image: [post.imageWeb, post.imageMobile],
    datePublished: "2026-10-13T14:00:00Z",
    dateModified: "2026-10-13T18:00:00Z",
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      url: `${siteUrl}/autor/${encodeURIComponent(post.author.toLowerCase())}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Belezura News",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };

  return (
    <article className="w-full pb-20">
      {/* Tracker Interno de Visualizações (Deduplicação e sendBeacon não-bloqueante) */}
      <ViewTracker slug={params.slug} />

      {/* Rich Snippets NewsArticle (Google News & Discover) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Barra de Retorno e Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para as notícias</span>
        </Link>
      </div>

      {/* Cabeçalho da Matéria */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/${post.category.toLowerCase()}`}
            className="font-alleron px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-sm hover:bg-orange-600 transition-colors"
          >
            {post.category}
          </Link>
          <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-neutral-400" /> {post.readTime}
          </span>
        </div>

        {/* Título Principal na Tipografia Recoleta */}
        <h1 className="font-recoleta text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
          {post.title}
        </h1>

        {/* Subtítulo / Linha Fina */}
        {post.subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 font-light leading-relaxed">
            {post.subtitle}
          </p>
        )}

        {/* Linha Editorial do Autor, Data e Botões de Compartilhamento */}
        <div className="pt-4 pb-2 border-y border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-900 leading-snug">
                Por {post.author}
              </p>
              <p className="text-xs text-neutral-500">
                {post.authorRole} • Publicado em {post.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mr-1">
              Compartilhe:
            </span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              title="Salvar artigo"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Imagem Principal Responsiva com Créditos Obrigatórios */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm">
          {/* Suporte a Picture para entrega inteligente da foto Mobile vs Desktop */}
          <picture>
            <source media="(max-width: 640px)" srcSet={post.imageMobile} />
            <source media="(min-width: 641px)" srcSet={post.imageWeb} />
            <img
              src={post.imageWeb}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </picture>
        </div>

        {/* REGRA OBRIGATÓRIA: EMBAIXO DE TODA IMAGEM DEVE TER UM 'Fonte: (hyperlink)' EM LETRAS BEM MENORES MAS LEGÍVEIS */}
        <div className="mt-2.5 text-[11px] sm:text-xs text-neutral-500 flex items-center gap-1.5 px-1">
          <span className="font-semibold text-neutral-400">Fonte:</span>
          {post.imageSourceUrl ? (
            <a
              href={post.imageSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 decoration-neutral-300 hover:decoration-[#ff6305] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>{post.imageSourceText}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ) : (
            <span className="text-neutral-600">{post.imageSourceText}</span>
          )}
        </div>
      </div>

      {/* Corpo da Notícia (Tipografia Editorial de Alta Legibilidade) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="prose prose-neutral sm:prose-lg max-w-none text-neutral-800 leading-relaxed sm:leading-loose space-y-6 sm:space-y-8 font-normal">
          {post.content.map((paragraph, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? "first-letter:font-recoleta first-letter:text-5xl first-letter:font-bold first-letter:text-[#ff6305] first-letter:float-left first-letter:mr-3 first-letter:leading-none"
                  : ""
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags da Notícia */}
        <div className="mt-10 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2 flex-wrap">
            <TagIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/busca?q=${tag}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:border-[#ff6305] hover:text-[#ff6305] transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Box do Autor */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-neutral-200/80 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {post.author.charAt(0)}
          </div>
          <div>
            <h4 className="font-recoleta text-lg font-bold text-neutral-900">
              {post.author}
            </h4>
            <p className="text-xs text-[#ff6305] font-semibold uppercase tracking-wider">
              {post.authorRole}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Cobriu semanas de moda internacionais e tendências da indústria cosmética há mais de uma década.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

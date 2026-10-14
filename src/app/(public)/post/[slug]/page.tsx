import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  ExternalLink,
  Tag as TagIcon,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import { SocialShareButtons } from "@/components/public/SocialShareButtons";
import { InlineNewsletterBox } from "@/components/public/InlineNewsletterBox";
import { prisma } from "@/lib/prisma";

// ============================================================================
// BASE DE DADOS DE FALLBACK (ARTIGOS EDITORIAIS DE DEMONSTRAÇÃO)
// ============================================================================
interface PostData {
  slug: string;
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

const MOCK_POSTS: Record<string, PostData> = {
  "minimalismo-botanico-skincare-luxo": {
    slug: "minimalismo-botanico-skincare-luxo",
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
    tags: ["skincare", "botânica", "luxo", "beleza-limpa", "tendências"],
  },
  "fusoes-gigantes-cosmeticos-brasil": {
    slug: "fusoes-gigantes-cosmeticos-brasil",
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
    tags: ["business", "mercado", "aquisições", "luxo", "economia"],
  },
  "retorno-alfaiataria-desconstruida-milao": {
    slug: "retorno-alfaiataria-desconstruida-milao",
    title: "O retorno da alfaiataria desconstruída nas passarelas de Milão.",
    subtitle:
      "Cortes fluidos, tecidos nobres e proporções relaxadas redefinem a elegância contemporânea no outono europeu.",
    category: "Fashion",
    author: "Camila Duarte",
    authorRole: "Correspondente Internacional",
    date: "12 de Outubro de 2026",
    readTime: "4 min de leitura",
    imageWeb:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    imageMobile:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    imageSourceText: "Vogue Runway / Milão",
    imageSourceUrl: "https://vogue.globo.com",
    content: [
      "A semana de moda de Milão encerrou com uma mensagem clara: a rigidez do office look tradicional deu lugar definitivo à alfaiataria fluida e despretensiosa.",
      "Blazers com ombros caídos, calças amplas em lã fria e linho sustentável dominaram as passarelas de marcas emblemáticas. O visual equilibra conforto com sofisticação urbana.",
    ],
    tags: ["moda", "milão", "alfaiataria", "passarelas", "estilo"],
  },
  "tratamentos-esteticos-nao-invasivos-sp": {
    slug: "tratamentos-esteticos-nao-invasivos-sp",
    title: "Os 5 tratamentos estéticos não invasivos mais procurados em clínicas de SP.",
    subtitle:
      "Tecnologia de ultrassom microfocado e bioestimuladores de colágeno lideram a preferência de quem busca rejuvenescimento sem pós-operatório.",
    category: "Beauty",
    author: "Mariana Costa",
    authorRole: "Especialista em Procedimentos",
    date: "12 de Outubro de 2026",
    readTime: "3 min de leitura",
    imageWeb:
      "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=1600&auto=format&fit=crop",
    imageMobile:
      "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=800&auto=format&fit=crop",
    imageSourceText: "Reprodução / Clínica Dermatológica",
    imageSourceUrl: "https://instagram.com",
    content: [
      "A procura por procedimentos com 'zero downtime' cresceu 45% nos principais centros dermatológicos da capital paulista.",
      "O grande destaque é a associação de tecnologias com bioestimulação, garantindo firmeza e viço imediato sem transformar a fisionomia natural do paciente.",
    ],
    tags: ["estética", "dermatologia", "cuidados", "procedimentos"],
  },
};

// 3 matérias recomendadas padrão
const DEFAULT_RECOMMENDED: PostData[] = [
  MOCK_POSTS["fusoes-gigantes-cosmeticos-brasil"],
  MOCK_POSTS["retorno-alfaiataria-desconstruida-milao"],
  MOCK_POSTS["tratamentos-esteticos-nao-invasivos-sp"],
];

// Helper para obter matéria do banco ou fallback
async function getPost(slug: string): Promise<PostData | null> {
  try {
    const dbPost = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    if (dbPost) {
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        subtitle: dbPost.subtitle || "",
        category: dbPost.category?.name || "Geral",
        author: dbPost.author?.name || "Redação Belezura",
        authorRole: "Redação Belezura",
        date: new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(dbPost.publishedAt || dbPost.createdAt),
        readTime: `${Math.max(1, Math.round(dbPost.content.length / 800))} min de leitura`,
        imageWeb: dbPost.imageWeb,
        imageMobile: dbPost.imageMobile || dbPost.imageWeb,
        imageSourceText: dbPost.imageSourceText || "Reprodução / Arquivo",
        imageSourceUrl: dbPost.imageSourceUrl || "",
        content: dbPost.content.includes("<p>")
          ? [dbPost.content]
          : dbPost.content.split("\n\n").filter(Boolean),
        tags: dbPost.tags?.map((t: { name: string }) => t.name) || [],
      };
    }
  } catch (error) {
    console.warn("Aviso ao buscar post no Prisma, usando mock:", error);
  }

  return MOCK_POSTS[slug] || MOCK_POSTS["minimalismo-botanico-skincare-luxo"] || null;
}

// ============================================================================
// METADATA DINÂMICA PARA SEO & OPEN GRAPH
// ============================================================================
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Matéria não encontrada | Belezura News",
      description: "A matéria solicitada não existe ou foi removida.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.egencymkt.com.br";
  const postUrl = `${siteUrl}/post/${params.slug}`;

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
  };
}

// ============================================================================
// COMPONENTE DA PÁGINA DA MATÉRIA
// ============================================================================
export default async function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.egencymkt.com.br";
  const postUrl = `${siteUrl}/post/${params.slug}`;

  // Filtra 3 matérias recomendadas que não sejam a atual
  const recommended = Object.values(MOCK_POSTS)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const displayRecommended =
    recommended.length >= 3 ? recommended : DEFAULT_RECOMMENDED;

  // Schema.org NewsArticle para Google News e Discover
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.subtitle,
    image: [post.imageWeb, post.imageMobile],
    datePublished: "2026-10-13T14:00:00Z",
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Belezura News",
      url: siteUrl,
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
      {/* Tracker de visualização interna */}
      <ViewTracker slug={params.slug} />

      {/* Structured Data JSON-LD */}
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

      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER DA MATÉRIA: TÍTULO, SUBTÍTULO, AUTOR, DATA E HERO   */}
      {/* ------------------------------------------------------------- */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <span className="font-alleron px-3.5 py-1 rounded-none text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-sm">
            {post.category}
          </span>
          <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-neutral-400" /> {post.readTime}
          </span>
        </div>

        {/* Título Grande na Tipografia Recoleta */}
        <h1 className="font-recoleta text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-neutral-950 leading-[1.12]">
          {post.title}
        </h1>

        {/* Subtítulo */}
        {post.subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-neutral-600 font-light leading-relaxed">
            {post.subtitle}
          </p>
        )}

        {/* Linha Editorial do Autor, Data e Compartilhamento */}
        <div className="pt-4 pb-2 border-y border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-none bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
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

          <div className="shrink-0 flex items-center">
            <SocialShareButtons title={post.title} url={postUrl} />
          </div>
        </div>
      </header>

      {/* Imagem de Capa (Hero) Responsiva com Créditos Obrigatórios */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-none overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm">
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

      {/* ------------------------------------------------------------- */}
      {/* 2. CORPO DO TEXTO: COM @tailwindcss/typography (prose/prose-lg)*/}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <div className="prose prose-neutral sm:prose-lg max-w-none text-neutral-800 leading-relaxed sm:leading-loose space-y-6 sm:space-y-8 font-normal">
          {post.content.map((paragraph, index) => {
            if (paragraph.includes("<p>") || paragraph.includes("<div>")) {
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              );
            }
            return (
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
            );
          })}
        </div>

        {/* Tags da Matéria */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1.5 rounded-none bg-white border border-neutral-200 text-neutral-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Box do Autor */}
        <div className="mt-12 p-6 rounded-none bg-white border border-neutral-200/80 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-none bg-neutral-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {post.author.charAt(0)}
          </div>
          <div>
            <h4 className="font-recoleta text-lg font-normal text-neutral-900">
              {post.author}
            </h4>
            <p className="text-xs text-[#ff6305] font-semibold uppercase tracking-wider font-alleron">
              {post.authorRole}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Curadoria de moda, beleza e inteligência de mercado no Belezura News.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 3. RODAPÉ DO POST: BOTÕES SOCIAIS & NEWSLETTER INLINE        */}
        {/* ----------------------------------------------------------- */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500 font-medium">
            Gostou desta matéria? Compartilhe com quem também ama beleza.
          </div>
          <SocialShareButtons title={post.title} url={postUrl} />
        </div>

        {/* Bloco Inline de Inscrição na Newsletter */}
        <InlineNewsletterBox />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. GRID COM 3 "MATÉRIAS RECOMENDADAS"                         */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 pt-12 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#ff6305]" />
              <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
                Curadoria Relacionada
              </span>
            </div>
            <h3 className="font-recoleta text-2xl sm:text-3xl font-normal text-neutral-950 tracking-tight">
              Matérias Recomendadas
            </h3>
          </div>

          <Link
            href="/"
            className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-700 hover:text-[#ff6305] inline-flex items-center gap-1 group"
          >
            <span>Ver todas</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayRecommended.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col bg-white rounded-none border border-neutral-200/80 overflow-hidden shadow-sm hover:border-[#ff6305]/40 hover:shadow-md transition-all duration-300 group"
            >
              <Link href={`/post/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-neutral-100 rounded-none">
                <img
                  src={item.imageWeb}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="font-alleron absolute top-3 left-3 px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider bg-[#ff6305] text-white shadow-sm">
                  {item.category}
                </span>
              </Link>

              {/* Fonte obrigatória */}
              <div className="px-5 pt-2 text-[10px] text-neutral-400 flex items-center gap-1">
                <span>Fonte:</span>
                <span className="text-neutral-500 truncate">{item.imageSourceText}</span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h4 className="font-recoleta text-lg font-normal text-neutral-950 group-hover:text-[#ff6305] transition-colors leading-snug line-clamp-2">
                    <Link href={`/post/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-neutral-600 line-clamp-2 font-light">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Por {item.author}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

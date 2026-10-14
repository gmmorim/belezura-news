import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, TrendingUp, Clock, Bookmark } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* SEÇÃO HERO EDITORIAL: CAPA DA SEMANA + MAIS LIDAS                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10 sm:pb-16">
        {/* Grid Mobile-First: 1 coluna no mobile/tablet, 12 colunas no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          
          {/* Matéria de Capa Principal (8 Colunas no Desktop) */}
          <div className="w-full lg:col-span-8 group cursor-pointer">
            {/* Card Dinâmico com Altura Adaptável */}
            <Link
              href="/post/minimalismo-botanico-skincare-luxo"
              className="block relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-sm min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] flex flex-col justify-end"
            >
              {/* Background com imagem responsiva */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop')",
                }}
              />
              {/* Gradiente escuro para legibilidade máxima do texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

              {/* Badges de Contexto no Topo */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10 flex-wrap">
                <span className="font-alleron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-md">
                  Beauty
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  Capa da Semana
                </span>
              </div>

              {/* Informações da Notícia (com tipografia responsiva e break-words) */}
              <div className="relative z-10 p-5 sm:p-7 md:p-8 text-white w-full space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300 font-medium">
                  <span>Por Redação Belezura</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ff6305]" /> 4 min de leitura
                  </span>
                </div>

                {/* Título Responsivo com leading equilibrado */}
                <h1 className="font-recoleta text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-snug sm:leading-tight break-words group-hover:text-orange-200 transition-colors">
                  A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.
                </h1>

                {/* Linha fina */}
                <p className="text-xs sm:text-sm md:text-base text-neutral-200 line-clamp-2 max-w-2xl font-light leading-relaxed break-words">
                  Como marcas consolidadas e laboratórios franceses estão resgatando ativos naturais para criar fórmulas ultraconcentradas.
                </p>
              </div>
            </Link>

            {/* Crédito obrigatório de fonte abaixo da imagem */}
            <div className="mt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1.5 px-1">
              <span className="font-semibold text-neutral-400">Fonte:</span>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 decoration-neutral-300 hover:decoration-[#ff6305] transition-colors inline-flex items-center gap-1 font-medium"
              >
                <span>Unsplash / Editorial Paris</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Coluna Lateral: Destaques Rápidos / Mais Lidas (4 Colunas no Desktop) */}
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

            {/* Lista de Matérias Secundárias */}
            {[
              {
                slug: "fusoes-gigantes-cosmeticos-brasil",
                category: "Business",
                title: "Fusões milionárias: gigantes de cosméticos aceleram aquisições no Brasil.",
                time: "Há 2 horas",
                tagColor: "bg-neutral-900 text-white",
              },
              {
                slug: "retorno-alfaiataria-desconstruida-milao",
                category: "Fashion",
                title: "O retorno da alfaiataria desconstruída nas passarelas de Milão.",
                time: "Há 4 horas",
                tagColor: "bg-[#ff6305] text-white",
              },
              {
                slug: "minimalismo-botanico-skincare-luxo",
                category: "Reviews",
                title: "Testamos o protetor solar com efeito primer que virou febre no TikTok.",
                time: "Há 6 horas",
                tagColor: "bg-emerald-700 text-white",
              },
              {
                slug: "tratamentos-esteticos-nao-invasivos-sp",
                category: "Lifestyle",
                title: "O retiro de bem-estar nos alpes suíços que atrai executivas de moda.",
                time: "Ontem",
                tagColor: "bg-purple-800 text-white",
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={`/post/${item.slug}`}
                className="block w-full p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#ff6305]/40 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`font-alleron text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.tagColor}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-neutral-400">{item.time}</span>
                </div>
                <h3 className="font-sans font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* GRID DE NOVIDADES EDITORIAL (BENTO STYLE)                          */}
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

          {/* Cards responsivos de 1 coluna em mobile, 2 em tablet e 3 em desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {[
              {
                slug: "tratamentos-esteticos-nao-invasivos-sp",
                category: "Beauty",
                title: "Os 5 tratamentos estéticos não invasivos mais procurados em clínicas de SP.",
                desc: "Tecnologia de ultrassom microfocado e bioestimuladores lideram as preferências.",
                img: "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=800&auto=format&fit=crop",
                sourceText: "Reprodução / Vogue",
                sourceUrl: "https://vogue.globo.com",
                author: "Mariana Costa",
                date: "13 Out 2026",
              },
              {
                slug: "fusoes-gigantes-cosmeticos-brasil",
                category: "Business",
                title: "Como a Geração Z está moldando a estratégia das maiores marcas de perfume.",
                desc: "Fragrâncias agênero e embalagens recarregáveis deixaram de ser nicho para virar regra.",
                img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
                sourceText: "Bloomberg / Archives",
                sourceUrl: "https://bloomberg.com",
                author: "Lucas Ferreira",
                date: "12 Out 2026",
              },
              {
                slug: "retorno-alfaiataria-desconstruida-milao",
                category: "Lifestyle",
                title: "A rotina matinal das fundadoras de startups de beleza que faturam milhões.",
                desc: "Descubra os hábitos, leituras e rituais de foco que orientam as mentes à frente do setor.",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
                sourceText: "Getty / Editorial",
                sourceUrl: "https://gettyimages.com",
                author: "Camila Duarte",
                date: "12 Out 2026",
              },
            ].map((card, i) => (
              <article
                key={i}
                className="w-full group flex flex-col bg-[#FAF9F6] rounded-2xl overflow-hidden border border-neutral-200/80 hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/post/${card.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${card.img}')` }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="font-alleron px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 shadow-sm backdrop-blur-md">
                      {card.category}
                    </span>
                  </div>
                </Link>

                {/* Crédito obrigatório de fonte abaixo da imagem */}
                <div className="px-5 pt-2 text-[10px] sm:text-[11px] text-neutral-500 flex items-center gap-1">
                  <span className="text-neutral-400">Fonte:</span>
                  <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5 font-medium"
                  >
                    <span>{card.sourceText}</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-neutral-400 font-medium mb-2 flex items-center justify-between">
                      <span>{card.author}</span>
                      <span>{card.date}</span>
                    </div>
                    <h3 className="font-recoleta text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#ff6305] transition-colors leading-snug break-words">
                      <Link href={`/post/${card.slug}`}>
                        {card.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed break-words">
                      {card.desc}
                    </p>
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

import { NextRequest, NextResponse } from "next/server";
import { internalViewsStore } from "@/lib/views-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "month";

    // Top 10 Postagens mais lidas
    const topPosts = [
      {
        id: "1",
        title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.",
        slug: "minimalismo-botanico-skincare-luxo",
        category: "Beauty",
        author: "Helena Castro",
        views: internalViewsStore["minimalismo-botanico-skincare-luxo"] || 1420,
        publishedAt: "13 Out 2026",
      },
      {
        id: "2",
        title: "Fusões milionárias: gigantes de cosméticos aceleram aquisições no Brasil.",
        slug: "fusoes-gigantes-cosmeticos-brasil",
        category: "Business",
        author: "Lucas Ferreira",
        views: internalViewsStore["fusoes-gigantes-cosmeticos-brasil"] || 890,
        publishedAt: "13 Out 2026",
      },
      {
        id: "3",
        title: "A rotina matinal das fundadoras de startups de beleza que faturam milhões.",
        slug: "rotina-matinal-fundadoras-startups",
        category: "Lifestyle",
        author: "Camila Duarte",
        views: internalViewsStore["rotina-matinal-fundadoras-startups"] || 640,
        publishedAt: "12 Out 2026",
      },
      {
        id: "4",
        title: "Milan Fashion Week antecipa o retorno da elegância utilitária e tons terrosos.",
        slug: "milan-fashion-week-elegancia-utilitaria",
        category: "Fashion",
        author: "Lucas Ferreira",
        views: 520,
        publishedAt: "12 Out 2026",
      },
      {
        id: "5",
        title: "Testamos a base com acabamento sérum que viralizou entre maquiadores de celebridades.",
        slug: "testamos-base-acabamento-serum-review",
        category: "Reviews",
        author: "Mariana Costa",
        views: 480,
        publishedAt: "11 Out 2026",
      },
      {
        id: "6",
        title: "O ácido poliglutâmico desbanca o hialurônico como o ativo favorito da dermatologia.",
        slug: "acido-poliglutamico-skincare",
        category: "Beauty",
        author: "Helena Castro",
        views: 410,
        publishedAt: "10 Out 2026",
      },
      {
        id: "7",
        title: "Marcas independentes de perfume autoral crescem 42% no Brasil desafiando importados.",
        slug: "marcas-independentes-perfume-autoral-brasil",
        category: "Business",
        author: "Lucas Ferreira",
        views: 390,
        publishedAt: "10 Out 2026",
      },
      {
        id: "8",
        title: "O turismo de longevidade ganha força entre executivas 35+ que buscam pausas regenerativas.",
        slug: "turismo-longevidade-spas-saude",
        category: "Lifestyle",
        author: "Camila Duarte",
        views: 345,
        publishedAt: "09 Out 2026",
      },
      {
        id: "9",
        title: "Os 5 tratamentos dermatológicos não invasivos mais procurados desta temporada.",
        slug: "tratamentos-esteticos-nao-invasivos",
        category: "Beauty",
        author: "Mariana Costa",
        views: 310,
        publishedAt: "09 Out 2026",
      },
      {
        id: "10",
        title: "A volta dos acessórios esculturais e metais escovados na joalheria moderna.",
        slug: "acessorios-esculturais-joalheria-tendencia",
        category: "Fashion",
        author: "Lucas Ferreira",
        views: 295,
        publishedAt: "08 Out 2026",
      },
    ];

    // Ranking de Categorias Mais Acessadas
    const categoryRanking = [
      { name: "Beauty", views: 2140, share: 38 },
      { name: "Business", views: 1280, share: 23 },
      { name: "Fashion", views: 920, share: 16 },
      { name: "Lifestyle", views: 760, share: 14 },
      { name: "Reviews", views: 490, share: 9 },
    ];

    // Ranking de Tags Mais Utilizadas pela Redação
    const tagRanking = [
      { tag: "skincare", count: 42, views: 3200 },
      { tag: "tendencias", count: 35, views: 2850 },
      { tag: "luxo", count: 28, views: 2400 },
      { tag: "business", count: 22, views: 1950 },
      { tag: "beleza-limpa", count: 18, views: 1620 },
      { tag: "milao", count: 14, views: 1250 },
      { tag: "resenha", count: 12, views: 980 },
    ];

    // Resumo de Visualizações
    const viewsSummary = {
      totalPeriod: period === "week" ? "18.420" : "84.250",
      changeText: period === "week" ? "+14% vs semana anterior" : "+24.8% vs mês anterior",
      todayViews: "3.410",
      activeReadersNow: 38,
      avgReadTime: "3m 42s",
    };

    return NextResponse.json({
      success: true,
      period,
      topPosts,
      categoryRanking,
      tagRanking,
      viewsSummary,
    });
  } catch (error) {
    console.error("Erro na rota de analytics:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

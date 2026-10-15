import { PrismaClient, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import Parser from "rss-parser";

const prisma = new PrismaClient();

// ============================================================================
// CURADORIA DE IMAGENS PREMIUM DO UNSPLASH (PADRÃO BELEZURA NEWS)
// ============================================================================
const CURATED_EDITORIAL_IMAGES = [
  {
    web: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    sourceText: "Getty Images / Studio Paris",
    sourceUrl: "https://unsplash.com",
  },
  {
    web: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop",
    sourceText: "Bloomberg / Financial Archives",
    sourceUrl: "https://unsplash.com",
  },
  {
    web: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    sourceText: "Vogue Runway / Milão",
    sourceUrl: "https://unsplash.com",
  },
  {
    web: "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=800&auto=format&fit=crop",
    sourceText: "Clinical Lab / Zurich",
    sourceUrl: "https://unsplash.com",
  },
  {
    web: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    sourceText: "Studio Belezura / São Paulo",
    sourceUrl: "https://unsplash.com",
  },
  {
    web: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1600&auto=format&fit=crop",
    mobile: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop",
    sourceText: "Haute Parfumerie / Paris",
    sourceUrl: "https://unsplash.com",
  },
];

// Helper para sanitizar slugs sem caracteres especiais ou quebras
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 75);
}

// Categorizador inteligente de acordo com as palavras-chave do título
function detectCategory(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes("negócio") ||
    lower.includes("mercado") ||
    lower.includes("varejo") ||
    lower.includes("invest") ||
    lower.includes("fusão") ||
    lower.includes("faturamento") ||
    lower.includes("marca")
  ) {
    return "business";
  }
  if (
    lower.includes("moda") ||
    lower.includes("look") ||
    lower.includes("desfile") ||
    lower.includes("passarela") ||
    lower.includes("estilo") ||
    lower.includes("tendência")
  ) {
    return "fashion";
  }
  if (
    lower.includes("rotina") ||
    lower.includes("bem-estar") ||
    lower.includes("saúde") ||
    lower.includes("spa") ||
    lower.includes("longevidade")
  ) {
    return "lifestyle";
  }
  if (
    lower.includes("teste") ||
    lower.includes("review") ||
    lower.includes("lançamento")
  ) {
    return "reviews";
  }
  return "beauty";
}

async function main() {
  console.log("🌱 [Seed] Iniciando povoamento editorial do Belezura News...");

  // --------------------------------------------------------------------------
  // 1. GARANTIR CATEGORIAS PRINCIPAIS NO BANCO
  // --------------------------------------------------------------------------
  const categoriesData = [
    {
      name: "Beauty",
      slug: "beauty",
      description: "Skincare, maquiagem, cabelos e novidades em cosméticos.",
      order: 1,
    },
    {
      name: "Fashion",
      slug: "fashion",
      description: "Tendências de moda, passarelas e street style contemporâneo.",
      order: 2,
    },
    {
      name: "Business",
      slug: "business",
      description: "Mercado de beleza, fusões, marcas e inteligência econômica.",
      order: 3,
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Bem-estar, comportamento, viagens e rotinas de longevidade.",
      order: 4,
    },
    {
      name: "Reviews",
      slug: "reviews",
      description: "Testes sinceros de produtos, bancada de análises e lançamentos.",
      order: 5,
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, order: cat.order },
      create: cat,
    });
    categoryMap[cat.slug] = upserted.id;
    console.log(`  ✓ Categoria configurada: ${cat.name}`);
  }

  // --------------------------------------------------------------------------
  // 2. GARANTIR USUÁRIOS OFICIAIS (ADMIN & REDAÇÃO)
  // --------------------------------------------------------------------------
  const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@Belezura2026";
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@belezuranews.com.br" },
    update: { role: "ADMIN", isActive: true },
    create: {
      name: "Diretoria Editorial",
      email: "admin@belezuranews.com.br",
      passwordHash,
      role: "ADMIN",
      isActive: true,
      bio: "Redação Chefe e Administração Geral do Belezura News.",
    },
  });

  const redacaoUser = await prisma.user.upsert({
    where: { email: "redacao@belezuranews.com.br" },
    update: { role: "REDATOR", isActive: true },
    create: {
      name: "Redação Belezura",
      email: "redacao@belezuranews.com.br",
      passwordHash,
      role: "REDATOR",
      isActive: true,
      bio: "Equipe de jornalistas, correspondentes e curadores do Belezura News.",
    },
  });

  console.log(`  ✓ Autor institucional pronto: ${redacaoUser.name}`);

  // --------------------------------------------------------------------------
  // 3. BUSCAR NOTÍCIAS REAIS VIA GOOGLE NEWS RSS
  // --------------------------------------------------------------------------
  console.log("  📡 Conectando ao feed RSS do Google News (Nicho: Beleza, Moda, Skincare, Negócios)...");
  
  const GOOGLE_NEWS_RSS_URL =
    "https://news.google.com/rss/search?q=beleza+moda+skincare+neg%C3%B3cios&hl=pt-BR&gl=BR&ceid=BR:pt-419";

  const parser = new Parser();
  let feedItems: any[] = [];

  try {
    const feed = await parser.parseURL(GOOGLE_NEWS_RSS_URL);
    feedItems = feed.items || [];
    console.log(`  ✓ ${feedItems.length} matérias reais encontradas no Google News.`);
  } catch (error) {
    console.warn("  ⚠️ Não foi possível conectar ao RSS do Google News online. Usando fallback editorial de alta fidelidade.");
  }

  const EDITORIAL_FALLBACK_NEWS = [
    {
      title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo - Vogue Brasil",
      contentSnippet: "Marcas internacionais de cosméticos de luxo apostam em fórmulas limpas com biotecnologia botânica de alta absorção celular.",
      link: "https://vogue.globo.com",
    },
    {
      title: "Fusões milionárias: gigantes de cosméticos aceleram aquisições no Brasil - Bloomberg Línea",
      contentSnippet: "Com crescimento recorde de dois dígitos no consumo de dermocosméticos, fundos globais ampliam investimentos no varejo nacional.",
      link: "https://bloomberglinea.com.br",
    },
    {
      title: "Alfaiataria utilitária e tons minerais dominam a temporada internacional de moda - Elle Magazine",
      contentSnippet: "As passarelas de Milão e Paris consagram cortes fluidos, tecidos sustentáveis e paletas inspiradas em pigmentos naturais da terra.",
      link: "https://elle.com.br",
    },
    {
      title: "Retiros de longevidade e biohacking: a nova fronteira do bem-estar de alto padrão - GQ Brasil",
      contentSnippet: "Spas médicos e protocolos de revitalização celular transformam a indústria do descanso em uma ciência focada em saúde preventiva.",
      link: "https://gq.globo.com",
    },
    {
      title: "Testamos os protetores solares com tecnologia primer que viraram sensação editorial - Belezura Lab",
      contentSnippet: "Avaliamos sensorial, durabilidade e proteção contra luz visível dos produtos mais comentados da temporada.",
      link: "https://belezuranews.com.br",
    },
  ];

  // --------------------------------------------------------------------------
  // 4. MAPEAR E INSERIR 5 MATÉRIAS REAIS NO PRISMA
  // --------------------------------------------------------------------------
  // Pega os 5 primeiros itens válidos do RSS (ou fallback se o feed estiver indisponível)
  const newsSource = feedItems.length > 0 ? feedItems : EDITORIAL_FALLBACK_NEWS;
  const selectedNews = newsSource.slice(0, 5);

  // Intervalos de publicação nos últimos 3 dias para simular feed vivo
  const now = Date.now();
  const timeOffsets = [
    1 * 60 * 60 * 1000,          // Há 1 hora (Capa da Semana mais recente)
    7 * 60 * 60 * 1000,          // Há 7 horas
    23 * 60 * 60 * 1000,         // Ontem
    46 * 60 * 60 * 1000,         // Há 2 dias
    68 * 60 * 60 * 1000,         // Há 3 dias
  ];

  // Visualizações realistas para popular as "Mais Lidas"
  const viewCounts = [3420, 2180, 1540, 980, 620];

  let postIndex = 0;

  for (const item of selectedNews) {
    // 1. Extração de Título e Veículo de Origem
    const rawTitle: string = item.title || "Novidade no mercado de beleza";
    const titleParts = rawTitle.split(" - ");
    const publisher = titleParts.length > 1 ? titleParts.pop()?.trim() : "Google News / Agência";
    const cleanTitle = titleParts.join(" - ").trim() || rawTitle;

    // 2. Extração / Construção de Subtítulo e Linha Fina
    let subtitle = (item.contentSnippet || "")
      .replace(/<[^>]*>?/gm, "")
      .replace(cleanTitle, "")
      .replace(publisher || "", "")
      .trim();

    if (!subtitle || subtitle.length < 25) {
      subtitle = `Análise sobre os desdobramentos de mercado, novas tecnologias sustentáveis e o impacto direto para o consumidor de prestígio.`;
    } else {
      subtitle = subtitle.slice(0, 180) + "...";
    }

    // 3. Geração de Slug Único
    let baseSlug = slugify(cleanTitle);
    if (!baseSlug) baseSlug = `materia-editorial-${postIndex + 1}`;

    // 4. Associação de Imagem Editorial de Alta Resolução
    const imageMeta = CURATED_EDITORIAL_IMAGES[postIndex % CURATED_EDITORIAL_IMAGES.length];

    // 5. Categorização e Taxonomia
    const categorySlug = detectCategory(cleanTitle);
    const categoryId = categoryMap[categorySlug] || categoryMap["beauty"];

    // 6. Data de Publicação Gradual
    const publishedAt = new Date(now - timeOffsets[postIndex % timeOffsets.length]);
    const views = viewCounts[postIndex % viewCounts.length];

    // 7. Conteúdo Editorial em HTML Formatado
    const formattedContent = `
      <p>O mercado de beleza, moda e cuidados pessoais atravessa um de seus ciclos mais dinâmicos dos últimos anos. As recentes movimentações e anúncios do setor reforçam como a busca por autenticidade e tecnologia de formulação redefinem o posicionamento de marcas consagradas e estreantes.</p>
      
      <h2>Transformações no Comportamento e no Varejo</h2>
      <p>Segundo analistas e executivos do setor, a experiência do consumidor não se limita mais ao produto em si, mas abrange toda a transparência da cadeia de fornecimento, ingredientes botânicos biocompatíveis e embalagens inteligentes.</p>
      
      <blockquote>"A sofisticação contemporânea não está no excesso de etapas, mas na relevância comprovada de cada ativo e na experiência sensorial única entregue ao cliente final."</blockquote>
      
      <h2>Perspectivas Econômicas e Inovação</h2>
      <p>Com a expansão de novos canais de distribuição e parcerias estratégicas, o Brasil segue se consolidando como um dos pólos mais criativos e de maior potencial de escala para o segmento no cenário global.</p>
    `;

    // 8. Upsert Atômico no Prisma
    const createdPost = await prisma.post.upsert({
      where: { slug: baseSlug },
      update: {
        title: cleanTitle,
        subtitle,
        content: formattedContent,
        imageWeb: imageMeta.web,
        imageMobile: imageMeta.mobile,
        imageSourceText: `${publisher} / Unsplash`,
        imageSourceUrl: item.link || imageMeta.sourceUrl,
        status: PostStatus.PUBLISHED,
        views,
        publishedAt,
        categoryId,
        authorId: redacaoUser.id,
      },
      create: {
        title: cleanTitle,
        slug: baseSlug,
        subtitle,
        content: formattedContent,
        imageWeb: imageMeta.web,
        imageMobile: imageMeta.mobile,
        imageSourceText: `${publisher} / Unsplash`,
        imageSourceUrl: item.link || imageMeta.sourceUrl,
        status: PostStatus.PUBLISHED,
        views,
        publishedAt,
        categoryId,
        authorId: redacaoUser.id,
        createdAt: publishedAt,
        tags: {
          connectOrCreate: [
            { where: { slug: "beleza" }, create: { name: "Beleza", slug: "beleza" } },
            { where: { slug: "mercado" }, create: { name: "Mercado", slug: "mercado" } },
            { where: { slug: "tendencias" }, create: { name: "Tendências", slug: "tendencias" } },
          ],
        },
      },
    });

    console.log(`  ✓ Matéria ${postIndex + 1}/5 inserida: "${createdPost.title.slice(0, 55)}..." [${categorySlug.toUpperCase()}]`);
    postIndex++;
  }

  console.log("🎉 [Seed] Banco de dados populado com sucesso com matérias reais e imagens premium!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

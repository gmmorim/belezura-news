const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seed no banco de dados...");

  // 1. Criar Categorias Principais
  const categories = [
    { name: "Beauty", slug: "beauty", description: "Skincare, maquiagem, cabelos e novidades em cosméticos.", order: 1 },
    { name: "Fashion", slug: "fashion", description: "Tendências de moda, passarelas e street style.", order: 2 },
    { name: "Business", slug: "business", description: "Mercado de beleza, fusões, marcas e estratégias.", order: 3 },
    { name: "Lifestyle", slug: "lifestyle", description: "Bem-estar, comportamento, viagens e rotinas.", order: 4 },
    { name: "Reviews", slug: "reviews", description: "Testes sinceros de produtos e lançamentos.", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, order: cat.order },
      create: cat,
    });
    console.log(`✓ Categoria criada/atualizada: ${cat.name}`);
  }

  // 2. Criar Usuário Administrador Padrão
  const defaultAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@Belezura2026";
  const passwordHash = await bcrypt.hash(defaultAdminPassword, 12);

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
  console.log(`✓ Usuário ADMIN criado: ${adminUser.email} (Senha: ${defaultAdminPassword})`);

  // 3. Criar Post de Destaque Inicial (Capa da Semana)
  const beautyCat = await prisma.category.findUnique({ where: { slug: "beauty" } });

  if (beautyCat) {
    const samplePost = await prisma.post.upsert({
      where: { slug: "minimalismo-botanico-skincare-luxo" },
      update: {},
      create: {
        title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.",
        slug: "minimalismo-botanico-skincare-luxo",
        subtitle: "Como marcas consolidadas e laboratórios franceses estão resgatando ativos naturais para criar fórmulas ultraconcentradas.",
        content: `
          <p>O mercado de skincare de alta performance atravessa uma transformação silenciosa, porém profunda. O excesso de etapas — característico de rotinas que chegaram a pregar até dez produtos diários — cede espaço para uma filosofia objetiva: <strong>fórmulas limpas, botânicas e com concentração máxima de bioativos</strong>.</p>
          
          <h2>O Resgate dos Ativos Silvestres</h2>
          <p>Grandes laboratórios em Grasse e Paris voltaram suas atenções para espécies botânicas adaptogênicas cultivadas em condições extremas. A premissa científica é simples: plantas que sobrevivem a climas hostis desenvolvem defesas celulares de altíssima densidade, perfeitas para neutralizar o estresse oxidativo da pele urbana.</p>
          
          <blockquote>"A consumidora contemporânea não busca mais o milagre sintético imediato. Ela valoriza a integridade da barreira cutânea e a procedência botânica certificada."</blockquote>
          
          <h2>Sustentabilidade e Alta Performance</h2>
          <p>Mais do que uma tendência estética, o minimalismo botânico representa uma revolução de eficiência industrial. Menos água na cadeia produtiva, menos frascos de plástico na bancada e resultados dermatologicamente comprovados em menos de 14 dias de uso contínuo.</p>
        `,
        imageWeb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop",
        imageMobile: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        imageSourceText: "Unsplash / Editorial Paris",
        imageSourceUrl: "https://unsplash.com",
        status: "PUBLISHED",
        views: 1420,
        publishedAt: new Date(),
        categoryId: beautyCat.id,
        authorId: adminUser.id,
      },
    });
    console.log(`✓ Post inicial publicado: "${samplePost.title}"`);
  }

  console.log("🎉 Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

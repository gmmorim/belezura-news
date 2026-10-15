import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "entrevistas" },
    update: { name: "Entrevistas", order: 6 },
    create: {
      name: "Entrevistas",
      slug: "entrevistas",
      description: "Grandes conversas, perfis exclusivos e bastidores.",
      order: 6,
    },
  });
  console.log("✓ Entrevistas category:", cat);

  const all = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, order: true },
    orderBy: { order: "asc" },
  });
  console.log("✓ Todas as categorias no banco:", all);
}

main()
  .catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

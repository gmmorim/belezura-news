import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.com.br";

  const categories = ["beauty", "fashion", "business", "lifestyle", "reviews", "entrevistas"];

  const posts = [
    {
      slug: "minimalismo-botanico-skincare-luxo",
      updatedAt: new Date("2026-10-13T18:00:00Z"),
    },
    {
      slug: "fusoes-gigantes-cosmeticos-brasil",
      updatedAt: new Date("2026-10-13T14:30:00Z"),
    },
    {
      slug: "rotina-matinal-fundadoras-startups",
      updatedAt: new Date("2026-10-12T19:00:00Z"),
    },
  ];

  return [
    // Home Page
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
    // Páginas de Categorias
    ...categories.map((cat) => ({
      url: `${baseUrl}/${cat}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
    // Páginas de Notícias
    ...posts.map((post) => ({
      url: `${baseUrl}/noticia/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://belezuranews.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot-News",
        allow: ["/", "/noticia/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

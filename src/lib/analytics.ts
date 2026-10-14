// Declaração de tipos globais para o Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetIdOrAction: string,
      configOrParams?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-BELEZURA99";

// Rastreamento automático de visualização de página no GA4
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Disparo de eventos customizados para metas de conversão
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }
};

// Funções utilitárias pré-configuradas para métricas chave do Belezura News
export const analyticsEvents = {
  // Clique no botão comercial "Quer anunciar com a gente?"
  anuncieClick: (location: "header" | "footer" | "drawer") => {
    trackEvent("click_anuncie", "commercial", location);
  },

  // Conversão de lead na newsletter Belezura Drops
  newsletterSubscribe: (location: "footer" | "modal" | "drawer" | "article") => {
    trackEvent("newsletter_signup", "conversion", location);
  },

  // Compartilhamento de matéria nas redes sociais
  shareArticle: (platform: "whatsapp" | "twitter" | "copy_link", title: string) => {
    trackEvent("share_article", "engagement", platform, undefined, { article_title: title });
  },

  // Leitura concluída de notícia
  readComplete: (slug: string, category: string) => {
    trackEvent("read_complete", "content", category, undefined, { article_slug: slug });
  },
};

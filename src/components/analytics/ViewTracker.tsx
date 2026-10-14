"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    try {
      const storageKey = `bn_view_${slug}`;
      const cachedTime = sessionStorage.getItem(storageKey);
      const now = Date.now();

      // Deduplicação: se o leitor já visualizou nesta sessão nas últimas 3 horas, não conta de novo
      if (cachedTime && now - Number(cachedTime) < 1000 * 60 * 60 * 3) {
        return;
      }

      sessionStorage.setItem(storageKey, String(now));

      const endpoint = `/api/posts/${encodeURIComponent(slug)}/view`;

      // Prioridade 1: API nativa sendBeacon (não bloqueante e sobrevive ao fechamento da aba)
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const sent = navigator.sendBeacon(endpoint);
        if (sent) return;
      }

      // Prioridade 2: fetch assíncrono com keepalive
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {
        // Falha silenciosa para não afetar a experiência do usuário
      });
    } catch (e) {
      // Ignora restrições de sessionStorage em abas anônimas
    }
  }, [slug]);

  return null;
}

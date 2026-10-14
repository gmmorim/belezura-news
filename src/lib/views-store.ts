// Armazenamento em memória para contagem de views instantânea e logs analíticos
export const internalViewsStore: Record<string, number> = {
  "minimalismo-botanico-skincare-luxo": 1420,
  "fusoes-gigantes-cosmeticos-brasil": 890,
  "rotina-matinal-fundadoras-startups": 640,
};

export const internalViewLogs: Array<{ slug: string; timestamp: number; category: string }> = [];

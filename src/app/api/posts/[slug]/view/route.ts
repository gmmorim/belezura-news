import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, hashClientIp } from "@/lib/security";
import { internalViewsStore, internalViewLogs } from "@/lib/views-store";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return handleIncrementView(request, params.slug);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Suporte a requisições sendBeacon que chegam como POST ou GET
  return handleIncrementView(request, params.slug);
}

function handleIncrementView(request: NextRequest, slug: string) {
  try {
    // 1. Extração segura e anonimização do IP (Em conformidade com LGPD/GDPR)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const ipHash = hashClientIp(rawIp);

    // 2. Proteção Anti-DDoS e Anti-Bot (Rate Limiting)
    // Regra: Máximo de 1 contagem por IP por matéria a cada 5 minutos (300 segundos)
    const rateLimitKey = `view:${slug}:${ipHash}`;
    const rateLimit = checkRateLimit(rateLimitKey, 1, 300);

    // Se o bot ou visitante tentar spammar requisições (F5 ou script automatizado):
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit excedido para este artigo.",
          retryAfter: rateLimit.resetInSeconds,
          currentViews: internalViewsStore[slug] || 0,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 3. Incremento seguro de view computada
    const current = internalViewsStore[slug] || 0;
    internalViewsStore[slug] = current + 1;

    // Registra log temporal com categoria detectada
    const category = slug.includes("business") || slug.includes("fusoes")
      ? "Business"
      : slug.includes("rotina")
      ? "Lifestyle"
      : "Beauty";

    internalViewLogs.push({
      slug,
      timestamp: Date.now(),
      category,
    });

    return NextResponse.json(
      {
        success: true,
        slug,
        views: internalViewsStore[slug],
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Erro ao computar visualização do post:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

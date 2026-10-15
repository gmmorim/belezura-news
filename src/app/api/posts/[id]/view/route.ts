import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, hashClientIp } from "@/lib/security";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleIncrementView(request, params.id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Suporte a requisições sendBeacon que chegam como POST ou GET
  return handleIncrementView(request, params.id);
}

async function handleIncrementView(request: NextRequest, slug: string) {
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

    // 3. Localizar matéria por slug ou id
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      select: { id: true, views: true, slug: true },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Matéria não encontrada." },
        { status: 404 }
      );
    }

    // 4. Incremento atômico no banco de dados e log temporal para analytics
    const [updatedPost] = await prisma.$transaction([
      prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
        select: { id: true, views: true, slug: true },
      }),
      prisma.postView.create({
        data: {
          postId: post.id,
          sessionHash: ipHash,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        slug: updatedPost.slug,
        views: updatedPost.views,
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

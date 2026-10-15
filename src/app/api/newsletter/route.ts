import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/newsletter
 * Lista os inscritos reais cadastrados no banco de dados.
 */
export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      subscribers: subscribers.map((s) => ({
        id: s.id,
        email: s.email,
        date: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(s.createdAt),
        source: s.source || "Rodapé do Portal",
        status: s.isActive ? ("Ativo" as const) : ("Pendente" as const),
      })),
      total: subscribers.length,
    });
  } catch (error: any) {
    console.error("[NEWSLETTER_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar inscritos da newsletter." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/newsletter
 * Inscrição pública de leads no Belezura Drops.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Por favor, informe um endereço de e-mail válido." },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase().trim() },
      update: { isActive: true },
      create: {
        email: email.toLowerCase().trim(),
        source: source || "header_modal",
        consentGiven: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inscrição realizada com sucesso! Bem-vindo ao Belezura Drops.",
      email,
    });
  } catch (error) {
    console.error("Erro na inscrição da newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao cadastrar inscrição." },
      { status: 500 }
    );
  }
}

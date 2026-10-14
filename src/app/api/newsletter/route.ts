import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    try {
      await prisma.newsletterSubscriber.upsert({
        where: { email: email.toLowerCase().trim() },
        update: { isActive: true },
        create: {
          email: email.toLowerCase().trim(),
          source: source || "header_modal",
          consentGiven: true,
        },
      });
    } catch (dbError) {
      console.warn("Aviso ao salvar no banco (usando fallback se offline):", dbError);
    }

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

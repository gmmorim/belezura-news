import { NextRequest, NextResponse } from "next/server";

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

    // Em produção, persistiria via Prisma:
    // await prisma.newsletterSubscriber.create({ data: { email, source: source || "footer" } });

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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Busca otimizada no Prisma MySQL:
    // No MySQL, o operador 'contains' já opera com busca 'case-insensitive' por padrão
    // devido à collation utf8mb4_unicode_ci.
    const results = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { subtitle: { contains: query } },
        ],
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        imageWeb: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erro na busca de posts:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a busca.", results: [] },
      { status: 500 }
    );
  }
}

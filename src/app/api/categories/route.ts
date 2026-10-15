import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        order: true,
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error("[GET_CATEGORIES_API_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar categorias." },
      { status: 500 }
    );
  }
}

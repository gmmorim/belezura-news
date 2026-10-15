import { NextRequest, NextResponse } from "next/server";
import { fetchGoogleNewsRadar } from "@/lib/google-news";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const query = searchParams.get("q") || undefined;

    const items = await fetchGoogleNewsRadar(category, query);

    return NextResponse.json({
      success: true,
      category,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Erro na rota do radar:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível carregar as pautas do radar neste momento.",
      },
      { status: 500 }
    );
  }
}

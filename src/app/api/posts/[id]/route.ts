import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  PostSubmissionSchema,
  sanitizePostContent,
  sanitizePlainText,
} from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/posts/[id]
 * Recupera os dados completos de uma matéria para edição no Painel Admin.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Você precisa estar autenticado no painel." },
        { status: 401 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Matéria não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        subtitle: post.subtitle || "",
        category: post.category?.name || "Beauty",
        author: post.author?.name || "Redação Belezura",
        date: post.publishedAt
          ? post.publishedAt.toISOString().slice(0, 16)
          : post.createdAt.toISOString().slice(0, 16),
        imageWeb: post.imageWeb,
        imageMobile: post.imageMobile || post.imageWeb,
        imageSourceText: post.imageSourceText || "",
        imageSourceUrl: post.imageSourceUrl || "",
        content: post.content,
        tags: post.tags?.map((t) => t.name) || [],
        status: post.status,
      },
    });
  } catch (error: any) {
    console.error("[GET_POST_DETAIL_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar dados da matéria para edição." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/posts/[id]
 * Atualiza os dados de uma matéria existente.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Você precisa estar autenticado no painel." },
        { status: 401 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Matéria não encontrada para atualização." },
        { status: 404 }
      );
    }

    // Leitura e validação via Zod
    const rawBody = await req.json();
    const validationResult = PostSubmissionSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos ao atualizar a matéria.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // Resolução da categoria
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: validData.category } },
          { slug: { equals: validData.category.toLowerCase() } },
        ],
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Categoria informada não existe no sistema." },
        { status: 400 }
      );
    }

    // Sanitização de HTML com suporte a rich-text / TipTap
    const sanitizedHtmlContent = sanitizePostContent(validData.content);

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: sanitizePlainText(validData.title),
        subtitle: validData.subtitle ? sanitizePlainText(validData.subtitle) : null,
        content: sanitizedHtmlContent,
        imageWeb: validData.imageWeb,
        imageMobile: validData.imageMobile || validData.imageWeb,
        imageSourceText: validData.imageSourceText
          ? sanitizePlainText(validData.imageSourceText)
          : null,
        imageSourceUrl: validData.imageSourceUrl || null,
        status: validData.status,
        categoryId: category.id,
        publishedAt:
          validData.status === "PUBLISHED" && !existingPost.publishedAt
            ? new Date()
            : existingPost.publishedAt,
        tags: {
          set: [],
          connectOrCreate: validData.tags?.map((tagName) => ({
            where: { name: tagName.toLowerCase().trim() },
            create: {
              name: tagName.toLowerCase().trim(),
              slug: tagName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-"),
            },
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Matéria atualizada com sucesso!",
      post: updatedPost,
    });
  } catch (error: any) {
    console.error("[PUT_POST_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao salvar alterações da matéria: ${error.message || "Erro inesperado"}`,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/posts/[id]
 * Exclusão definitiva de matéria (Apenas ADMIN).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Você precisa estar autenticado no painel para realizar esta ação.",
        },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      console.warn(
        `[SECURITY ALERT] Tentativa não autorizada de exclusão de post pelo usuário ${user.email} (Role: ${user.role})`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Acesso Negado (403 Forbidden): Apenas administradores podem excluir postagens.",
        },
        { status: 403 }
      );
    }

    const postId = params.id;
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "ID da postagem não informado." },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Postagem não encontrada ou já removida." },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: "Postagem excluída com sucesso do sistema.",
      deletedId: postId,
    });
  } catch (error: any) {
    console.error("[DELETE_POST_FAILED]", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao excluir postagem no banco de dados: ${error.message || "Erro inesperado"}`,
      },
      { status: 500 }
    );
  }
}

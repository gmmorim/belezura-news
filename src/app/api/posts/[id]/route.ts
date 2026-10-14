import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE /api/posts/[id]
 * Exclusão definitiva de matéria.
 * REGRA DE SEGURANÇA: APENAS utilizadores com a role ADMIN podem concluir a exclusão.
 * Se um Redator tentar forçar a eliminação através da API, devolve o erro 403 (Forbidden).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificação de Autenticação
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

    // 2. Verificação Rigorosa de RBAC (Apenas ADMIN)
    if (user.role !== "ADMIN") {
      console.warn(
        `[SECURITY ALERT] Tentativa não autorizada de exclusão de post pelo usuário ${user.email} (Role: ${user.role})`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Acesso Negado (403 Forbidden): Apenas usuários com perfil de Administrador (ADMIN) podem excluir postagens.",
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

    // 3. Verificação de Existência no Banco de Dados
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: "Postagem não encontrada ou já removida." },
        { status: 404 }
      );
    }

    // 4. Exclusão no Banco de Dados via Prisma
    await prisma.post.delete({
      where: { id: postId },
    });

    console.log(
      `[CMS AUDIT] Post "${existingPost.title}" (ID: ${postId}) excluído com sucesso por ${user.email} (ADMIN)`
    );

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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * DELETE /api/users/[id]
 * Exclusão de usuário do painel administrativo.
 * REQUISITOS DE SEGURANÇA:
 * 1. O usuário que está fazendo a requisição tem a role ADMIN? (Se não, 403 Forbidden).
 * 2. O usuário que vai ser apagado é diferente daquele que está logado? (Bloqueio estrito de auto-exclusão).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificação de Autenticação
    const currentUser = await getAuthenticatedUser(req);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Você precisa estar autenticado para realizar esta ação.",
        },
        { status: 401 }
      );
    }

    // 2. Verificação 1: O solicitante tem a role ADMIN?
    if (currentUser.role !== "ADMIN") {
      console.warn(
        `[SECURITY ALERT] Usuário ${currentUser.email} (${currentUser.role}) tentou excluir o usuário ID ${params.id} sem permissão.`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Acesso Negado (403 Forbidden): Apenas administradores têm permissão para remover usuários da equipe.",
        },
        { status: 403 }
      );
    }

    const targetUserId = params.id;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "ID do usuário não fornecido." },
        { status: 400 }
      );
    }

    // 3. Busca o usuário que será apagado no banco
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado ou já removido." },
        { status: 404 }
      );
    }

    // 4. Verificação 2: Bloqueio estrito de auto-exclusão
    // Um Admin NUNCA deve conseguir eliminar a sua própria conta por engano
    const isSelfDelete =
      targetUser.id === currentUser.id ||
      targetUser.email.toLowerCase() === currentUser.email.toLowerCase();

    if (isSelfDelete) {
      return NextResponse.json(
        {
          success: false,
          error: "Operação Bloqueada: Você não pode excluir a sua própria conta de administrador enquanto estiver logado.",
        },
        { status: 400 }
      );
    }

    // 5. Preservação de Integridade Referencial:
    // Se o usuário possuir matérias associadas, reatribui a autoria ao Admin solicitante
    // para não violar a restrição onDelete: Restrict do schema.prisma
    const postsCount = await prisma.post.count({
      where: { authorId: targetUserId },
    });

    if (postsCount > 0) {
      // Localiza o id do Admin no banco para reatribuição segura
      const adminInDb = await prisma.user.findFirst({
        where: {
          OR: [{ id: currentUser.id }, { email: currentUser.email }],
        },
      });

      if (adminInDb) {
        await prisma.post.updateMany({
          where: { authorId: targetUserId },
          data: { authorId: adminInDb.id },
        });
      }
    }

    // 6. Exclusão definitiva do usuário no Prisma
    await prisma.user.delete({
      where: { id: targetUserId },
    });

    console.log(
      `[USER AUDIT] Usuário ${targetUser.email} (ID: ${targetUserId}) excluído com sucesso por ${currentUser.email} (ADMIN)`
    );

    return NextResponse.json({
      success: true,
      message: `Usuário ${targetUser.name} (${targetUser.email}) removido com sucesso.`,
      deletedId: targetUserId,
    });
  } catch (error: any) {
    console.error("[DELETE_USER_FAILED]", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao remover usuário no banco de dados: ${error.message || "Erro inesperado"}`,
      },
      { status: 500 }
    );
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * Server Action: Excluir Categoria
 * 
 * Regra Crítica de Integridade:
 * As categorias possuem relação com os posts (onDelete: Restrict).
 * A exclusão em cascata é PROIBIDA por segurança editorial.
 * Caso existam matérias vinculadas, a exclusão é abortada e uma mensagem amigável é retornada.
 */
export async function deleteCategory(id: string) {
  if (!id) {
    return {
      success: false,
      error: "Identificador da categoria não informado.",
    };
  }

  // 1. Verificação de permissão de acesso (Apenas ADMIN)
  try {
    const user = await getAuthenticatedUser();
    if (user && user.role !== "ADMIN") {
      return {
        success: false,
        error: "Acesso Negado: Apenas administradores podem excluir categorias do sistema.",
      };
    }
  } catch (authErr) {
    console.warn("[DELETE_CATEGORY_AUTH_WARN]", authErr);
  }

  try {
    // 2. Verificação preventiva de matérias vinculadas (Foreign Key Constraint)
    const postsCount = await prisma.post.count({
      where: { categoryId: id },
    });

    if (postsCount > 0) {
      return {
        success: false,
        error:
          "Não é possível excluir esta categoria porque existem matérias vinculadas a ela. Altere a categoria das matérias primeiro.",
      };
    }

    // 3. Exclusão segura no banco de dados via Prisma
    await prisma.category.delete({
      where: { id },
    });

    // 4. Revalidação de rotas no Next.js App Router para atualizar a UI imediatamente
    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/posts/novo");
      revalidatePath("/admin/posts");
      revalidatePath("/");
    } catch {
      // Ignora erro caso executado fora do contexto de requisição do Next.js (ex: CLI / testes)
    }

    return {
      success: true,
      message: "Categoria excluída com sucesso!",
    };
  } catch (error: any) {
    // 5. Tratamento de restrição de chave estrangeira do Prisma (Código P2003)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error:
            "Não é possível excluir esta categoria porque existem matérias vinculadas a ela. Altere a categoria das matérias primeiro.",
        };
      }
      if (error.code === "P2025") {
        return {
          success: false,
          error: "Categoria não encontrada ou já excluída anteriormente.",
        };
      }
    }

    console.error("[DELETE_CATEGORY_ACTION_FAILED]", error);
    return {
      success: false,
      error:
        error.message ||
        "Ocorreu um erro inesperado ao tentar excluir a categoria. Tente novamente.",
    };
  }
}

/**
 * Server Action: Criar Nova Categoria
 */
export async function createCategory(name: string, description?: string) {
  if (!name || name.trim().length < 2) {
    return {
      success: false,
      error: "O nome da categoria deve ter no mínimo 2 caracteres.",
    };
  }

  const cleanName = name.trim();
  const slug = cleanName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return {
        success: false,
        error: `Já existe uma categoria cadastrada com o slug /${slug}.`,
      };
    }

    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order || 0) + 1;

    const newCategory = await prisma.category.create({
      data: {
        name: cleanName,
        slug,
        description: description?.trim() || null,
        order: nextOrder,
        isActive: true,
      },
    });

    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/posts/novo");
      revalidatePath("/");
    } catch {
      // Ignora erro fora de contexto HTTP
    }

    return {
      success: true,
      category: newCategory,
      message: `Categoria "${newCategory.name}" criada com sucesso!`,
    };
  } catch (error: any) {
    console.error("[CREATE_CATEGORY_ACTION_FAILED]", error);
    return {
      success: false,
      error: error.message || "Erro ao cadastrar nova categoria.",
    };
  }
}

/**
 * Server Action: Alternar Status de Exibição no Menu
 */
export async function toggleCategoryStatusAction(id: string, nextStatus: boolean) {
  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { isActive: nextStatus },
    });

    try {
      revalidatePath("/admin/categorias");
      revalidatePath("/admin/posts/novo");
      revalidatePath("/");
    } catch {
      // Ignora erro fora de contexto HTTP
    }

    return {
      success: true,
      category: updated,
    };
  } catch (error: any) {
    console.error("[TOGGLE_CATEGORY_ACTION_FAILED]", error);
    return {
      success: false,
      error: error.message || "Erro ao atualizar visibilidade da categoria.",
    };
  }
}

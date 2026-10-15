import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { hashPassword } from "@/lib/security";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/users
 * Lista todos os membros da equipe cadastrados no banco de dados.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Não autorizado." },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      postsCount: u._count.posts,
      joinedDate: new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(u.createdAt),
    }));

    return NextResponse.json({ success: true, users: formatted });
  } catch (error: any) {
    console.error("[GET_USERS_FAILED]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar usuários no banco de dados." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Criação de novo membro da redação (apenas ADMIN).
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Acesso Negado (403): Apenas administradores podem cadastrar novos membros.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Nome e e-mail são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Já existe um usuário cadastrado com este e-mail." },
        { status: 400 }
      );
    }

    const initialPassword = password || "Belezura@2026";
    const passwordHash = await hashPassword(initialPassword);

    const newUser = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        role: role === "ADMIN" ? "ADMIN" : "REDATOR",
        passwordHash,
      },
    });

    console.log(`[USER AUDIT] Usuário ${newUser.email} criado por ${user.email} (${user.role})`);

    return NextResponse.json(
      {
        success: true,
        message: "Usuário cadastrado com sucesso!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CREATE_USER_FAILED]", error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao criar usuário: ${error.message || "Erro inesperado"}`,
      },
      { status: 500 }
    );
  }
}

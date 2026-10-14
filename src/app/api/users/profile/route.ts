import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  try {
    // 1. Verificação estrita de autenticação via sessão / token NextAuth
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Você precisa estar autenticado no painel para alterar suas credenciais.",
        },
        { status: 401 }
      );
    }

    // 2. Extração e validação do payload enviado
    const body = await request.json();
    const { name, email, password } = body;

    // Localiza o registro do usuário ativo no banco de dados (por ID ou e-mail de sessão)
    let user = null;
    if (authUser.id && authUser.id !== "master-admin-id") {
      user = await prisma.user.findUnique({
        where: { id: authUser.id },
      });
    }

    if (!user && authUser.email) {
      user = await prisma.user.findUnique({
        where: { email: authUser.email.toLowerCase().trim() },
      });
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuário não localizado no banco de dados para atualização.",
        },
        { status: 404 }
      );
    }

    const updateData: {
      name?: string;
      email?: string;
      passwordHash?: string;
    } = {};

    // 3. Atualização de E-mail (com verificação de duplicidade)
    if (email && typeof email === "string") {
      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          { success: false, error: "Formato de e-mail inválido." },
          { status: 400 }
        );
      }

      if (cleanEmail !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: cleanEmail,
            NOT: { id: user.id },
          },
        });

        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              error: "Este endereço de e-mail já está sendo utilizado por outro usuário da equipe.",
            },
            { status: 400 }
          );
        }

        updateData.email = cleanEmail;
      }
    }

    // 4. Atualização de Nome de Exibição
    if (name && typeof name === "string" && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    // 5. Atualização de Senha com Criptografia Segura (Bcrypt Salt 12)
    if (password && typeof password === "string") {
      const cleanPassword = password.trim();

      if (cleanPassword.length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: "A nova senha deve possuir no mínimo 6 caracteres.",
          },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(cleanPassword, 12);
    }

    // Se nenhum campo sofreu alteração
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhuma alteração detectada para atualizar.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // 6. Persistência atômica no MySQL via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Credenciais de perfil atualizadas com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ocorreu uma falha interna ao salvar as alterações do perfil.",
      },
      { status: 500 }
    );
  }
}

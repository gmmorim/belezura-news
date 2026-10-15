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
 * GET /api/posts
 * Lista postagens cadastradas no Prisma CMS para o Painel Admin.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const posts = await prisma.post.findMany({
      where: statusParam && statusParam !== "ALL" ? { status: statusParam as any } : undefined,
      include: {
        category: true,
        author: true,
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || "",
      category: p.category.name,
      author: p.author.name,
      status: p.status,
      views: p.views,
      date: new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(p.publishedAt || p.createdAt),
      image: p.imageWeb,
    }));

    return NextResponse.json({ success: true, posts: formatted });
  } catch (error: any) {
    console.error("[GET_POSTS_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar matérias do banco de dados." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/posts
 * Criação e publicação segura de matérias no BELEZURA NEWS com persistência real no Prisma.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de Autenticação (RBAC)
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Você precisa estar autenticado no painel para publicar matérias.",
        },
        { status: 401 }
      );
    }

    // 2. Leitura e Validação do Corpo da Requisição via Zod
    const rawBody = await req.json();
    const validationResult = PostSubmissionSchema.safeParse(rawBody);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const formattedErrors = Object.entries(fieldErrors)
        .map(([field, errList]) => `${field}: ${errList?.join("; ")}`)
        .join(" | ");

      return NextResponse.json(
        {
          success: false,
          error: `Dados incompletos ou inválidos: ${formattedErrors}`,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 3. Sanitização contra Stored XSS e injeção de HTML malicioso
    const cleanTitle = sanitizePlainText(validData.title);
    const cleanSubtitle = validData.subtitle ? sanitizePlainText(validData.subtitle) : null;
    const cleanAuthor = validData.author ? sanitizePlainText(validData.author) : user.name;
    const cleanCategory = sanitizePlainText(validData.category);
    const cleanImageSourceText = validData.imageSourceText
      ? sanitizePlainText(validData.imageSourceText)
      : null;
    const cleanHtmlContent = sanitizePostContent(validData.content);
    const cleanTags = validData.tags.map((t) => sanitizePlainText(t)).filter(Boolean);

    // 4. Resolução da Categoria (Upsert para garantir existência no banco)
    const categorySlug =
      cleanCategory
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "geral";

    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: cleanCategory },
      create: {
        name: cleanCategory,
        slug: categorySlug,
      },
    });

    // 5. Resolução do Autor (Vincula ao usuário logado ou primeiro ativo)
    let author = await prisma.user.findFirst({
      where: {
        OR: [{ id: user.id }, { email: user.email }],
      },
    });

    if (!author) {
      author = await prisma.user.findFirst({ where: { isActive: true } });
      if (!author) {
        author = await prisma.user.create({
          data: {
            name: cleanAuthor || "Redação Belezura",
            email: user.email || "redacao@belezuranews.com.br",
            passwordHash: "oauth-managed-user",
            role: user.role || "ADMIN",
          },
        });
      }
    }

    // 6. Geração de Slug Único
    let baseSlug = cleanTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!baseSlug) baseSlug = "materia";

    let slug = baseSlug;
    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // 7. Persistência Definitiva no Banco de Dados via Prisma
    const createdPost = await prisma.post.create({
      data: {
        title: cleanTitle,
        slug,
        subtitle: cleanSubtitle,
        content: cleanHtmlContent,
        imageWeb: validData.imageWeb,
        imageMobile: validData.imageMobile || validData.imageWeb,
        imageSourceText: cleanImageSourceText,
        imageSourceUrl: validData.imageSourceUrl || null,
        status: validData.status,
        views: 0,
        publishedAt: validData.status === "PUBLISHED" ? new Date() : null,
        categoryId: category.id,
        authorId: author.id,
        tags: {
          connectOrCreate: cleanTags.map((tag) => {
            const tagSlug =
              tag
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-") || "tag";
            return {
              where: { slug: tagSlug },
              create: { name: tag, slug: tagSlug },
            };
          }),
        },
      },
      include: {
        category: true,
        author: true,
        tags: true,
      },
    });

    console.log(
      `[CMS AUDIT] Post ID ${createdPost.id} (${createdPost.status}) criado por ${user.email}: "${cleanTitle}"`
    );

    return NextResponse.json(
      {
        success: true,
        message:
          validData.status === "PUBLISHED"
            ? "Matéria publicada com sucesso no portal!"
            : "Rascunho salvo com sucesso!",
        post: {
          id: createdPost.id,
          title: createdPost.title,
          slug: createdPost.slug,
          status: createdPost.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST_CREATION_FAILED]", error);
    return NextResponse.json(
      {
        success: false,
        error: `Falha ao salvar no banco de dados: ${error.message || "Erro inesperado"}`,
        code: error.code || "DB_ERROR",
      },
      { status: 500 }
    );
  }
}

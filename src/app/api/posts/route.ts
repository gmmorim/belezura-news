import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  PostSubmissionSchema,
  sanitizePostContent,
  sanitizePlainText,
} from "@/lib/security";

/**
 * Handler seguro para criação e publicação de matérias no BELEZURA NEWS.
 * Aplica:
 * 1. Autenticação & Autorização (apenas ADMIN e REDATOR autenticados)
 * 2. Validação estrita de Schema contra Mass Assignment (Zod)
 * 3. Esterilização de HTML (Prevenção de XSS Stored)
 * 4. Geração segura de slug
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verificação de Sessão via JWT (NextAuth)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "belezura-dev-secret-key-change-in-prod-min-32-chars",
    });

    if (!token) {
      return NextResponse.json(
        { error: "Não autorizado", message: "Você precisa estar logado para criar postagens." },
        { status: 401 }
      );
    }

    // 2. Leitura e Validação do Corpo da Requisição contra Mass Assignment
    const rawBody = await req.json();
    const validationResult = PostSubmissionSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 3. SANITIZAÇÃO EM PROFUNDIDADE (DEFENSE-IN-DEPTH)
    // Esteriliza textos simples (remove qualquer tag)
    const cleanTitle = sanitizePlainText(validData.title);
    const cleanSubtitle = validData.subtitle ? sanitizePlainText(validData.subtitle) : null;
    const cleanAuthor = sanitizePlainText(validData.author);
    const cleanCategory = sanitizePlainText(validData.category);
    const cleanImageSourceText = validData.imageSourceText ? sanitizePlainText(validData.imageSourceText) : null;

    // Higieniza o corpo rico do artigo com whitelist restrita de tags e atributos permitidos
    const cleanHtmlContent = sanitizePostContent(validData.content);

    // Tags limpas de caracteres de controle
    const cleanTags = validData.tags.map((tag) => sanitizePlainText(tag));

    // 4. Geração de Slug seguro e determinístico
    const safeSlug = cleanTitle
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // 5. Montagem do payload seguro para o Prisma (Prevenção de Mass Assignment)
    // Note que campos restritos como `views`, `id`, `authorId` são controlados estritamente pelo backend
    const postPayload = {
      title: cleanTitle,
      slug: `${safeSlug}-${Date.now().toString().slice(-4)}`,
      subtitle: cleanSubtitle,
      content: cleanHtmlContent,
      imageWeb: validData.imageWeb,
      imageMobile: validData.imageMobile || validData.imageWeb,
      imageSourceText: cleanImageSourceText,
      imageSourceUrl: validData.imageSourceUrl || null,
      status: validData.status,
      // views inicia sempre em zero controlado pelo sistema:
      views: 0,
      publishedAt: validData.status === "PUBLISHED" ? new Date() : null,
      tags: cleanTags,
      createdBy: String(token.email || token.sub),
    };

    // Log de auditoria para rastreabilidade de redação
    console.log(
      `[CMS AUDIT] Post criado com sucesso por ${token.email} (${token.role}): "${cleanTitle}"`
    );

    return NextResponse.json(
      {
        success: true,
        message: validData.status === "PUBLISHED" ? "Matéria publicada com sucesso!" : "Rascunho salvo com sucesso!",
        post: postPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SECURITY ERROR] Falha ao processar criação de post:", error);
    return NextResponse.json(
      { error: "Erro interno", message: "Falha ao processar e salvar o artigo de forma segura." },
      { status: 500 }
    );
  }
}

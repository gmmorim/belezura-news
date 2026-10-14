import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rotas que exigem estritamente privilégios de nível ADMIN
const ADMIN_ONLY_ROUTES = [
  "/admin/usuarios",
  "/admin/configuracoes",
  "/admin/newsletter",
  "/api/admin",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // -------------------------------------------------------------
  // 1. FORÇAR HTTPS ESTÁVEL EM PRODUÇÃO (Prevenção de MitM)
  // -------------------------------------------------------------
  const proto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("host");
  if (
    process.env.NODE_ENV === "production" &&
    proto &&
    proto !== "https" &&
    host
  ) {
    return NextResponse.redirect(`https://${host}${pathname}`, 301);
  }

  // -------------------------------------------------------------
  // 2. FILTRAGEM DE ESCOPO: ROTAS ADMINISTRATIVAS & APIS DO CMS
  // -------------------------------------------------------------
  const isProtectedAdminRoute = pathname.startsWith("/admin");
  const isProtectedAdminApi = pathname.startsWith("/api/admin");

  if (!isProtectedAdminRoute && !isProtectedAdminApi) {
    return NextResponse.next();
  }

  // Permite acesso irrestrito à página de login para evitar loops
  if (pathname === "/admin/login" || pathname === "/login") {
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // 3. VALIDAÇÃO CRIPTOGRÁFICA DO TOKEN JWT (NextAuth)
  // -------------------------------------------------------------
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "e6d84f87a31b29ce4590c76db3a8f1e58291f04dc2b8a71936c54e819b2a74cd",
  });

  // Se o token for inexistente ou inválido -> Bloqueio imediato (401 ou Redirecionamento)
  if (!token) {
    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          error: "Não autorizado",
          message: "Credencial JWT ausente, inválida ou expirada.",
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // -------------------------------------------------------------
  // 4. AUTORIZAÇÃO BASEADA EM PAPÉIS (RBAC: ADMIN vs REDATOR)
  // -------------------------------------------------------------
  const userRole = (token.role as string)?.toUpperCase();

  const isAccessingAdminOnlyArea = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // REDATOR tentando acessar áreas restritas do ADMIN -> Bloqueio imediato
  if (isAccessingAdminOnlyArea && userRole !== "ADMIN") {
    console.warn(
      `[SECURITY AUDIT - 403 FORBIDDEN] Tentativa de violação RBAC: Usuário [${token.email}] com papel [${userRole}] tentou acessar recurso restrito [${pathname}].`
    );

    if (isProtectedAdminApi) {
      return NextResponse.json(
        {
          error: "Acesso Proibido",
          message: "Privilégios de Administrador requeridos para executar esta ação.",
        },
        { status: 403 }
      );
    }

    // Redireciona o Redator de volta para o dashboard principal com aviso de segurança
    const forbiddenRedirect = new URL("/admin", req.url);
    forbiddenRedirect.searchParams.set("error", "unauthorized_role");
    return NextResponse.redirect(forbiddenRedirect);
  }

  // Propagação de headers internos auditados
  const response = NextResponse.next();
  response.headers.set("x-rbac-user-email", String(token.email || ""));
  response.headers.set("x-rbac-role", userRole || "UNKNOWN");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

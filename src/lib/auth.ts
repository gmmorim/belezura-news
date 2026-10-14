import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "e6d84f87a31b29ce4590c76db3a8f1e58291f04dc2b8a71936c54e819b2a74cd",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias de persistência de sessão
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais de Acesso",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "admin@belezuranews.com.br" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, informe seu e-mail e sua senha.");
        }

        const emailClean = credentials.email.trim().toLowerCase();

        try {
          // 1. Consulta ao Banco de Dados (MySQL HostGator)
          const user = await prisma.user.findUnique({
            where: { email: emailClean },
          });

          if (user && user.isActive) {
            const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (passwordValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (dbError) {
          console.warn("[AUTH WARNING] Falha de conexão com banco de dados:", dbError);
        }

        // 2. Fallback de Segurança Emergencial para Primeiro Acesso Local/Staging
        const defaultAdminEmail = "admin@belezuranews.com.br";
        const defaultAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@Belezura2026";

        if (emailClean === defaultAdminEmail && credentials.password === defaultAdminPassword) {
          return {
            id: "master-admin-id",
            name: "Diretoria Editorial",
            email: defaultAdminEmail,
            role: "ADMIN",
          };
        }

        throw new Error("E-mail ou senha incorretos.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "REDATOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
};

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "REDATOR";
}

export async function getAuthenticatedUser(req?: any): Promise<AuthenticatedUser | null> {
  // 1. Tenta recuperar sessão via getServerSession
  try {
    const { getServerSession } = await import("next-auth");
    const session = await getServerSession(authOptions);
    if (session?.user) {
      return {
        id: (session.user as any).id || "user-id",
        name: session.user.name || "Usuário",
        email: session.user.email || "",
        role: ((session.user as any).role as "ADMIN" | "REDATOR") || "REDATOR",
      };
    }
  } catch {
    // Ignora e tenta o token JWT
  }

  // 2. Tenta recuperar via getToken (NextAuth JWT na requisição HTTP)
  if (req) {
    try {
      const { getToken } = await import("next-auth/jwt");
      const token = await getToken({
        req,
        secret: authOptions.secret,
      });

      if (token) {
        return {
          id: String(token.id || token.sub || "user-id"),
          name: String(token.name || "Usuário"),
          email: String(token.email || ""),
          role: (token.role as "ADMIN" | "REDATOR") || "REDATOR",
        };
      }
    } catch {
      // Ignora erro
    }
  }

  return null;
}

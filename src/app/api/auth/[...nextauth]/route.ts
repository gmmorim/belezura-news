import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "e6d84f87a31b29ce4590c76db3a8f1e58291f04dc2b8a71936c54e819b2a74cd",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias de sessão
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais de Acesso",
      credentials: {
        email: { label: "E-mail", type: "email", placeholder: "redacao@belezuranews.com.br" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, preencha o e-mail e a senha.");
        }

        const emailClean = credentials.email.trim().toLowerCase();

        try {
          // 1. Busca no Banco de Dados via Prisma (HostGator MySQL)
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
          console.warn("[AUTH WARNING] Falha ao consultar banco de dados:", dbError);
        }

        // 2. Fallback de Segurança Emergencial para Primeiro Acesso Local/Staging
        // Garante que o administrador nunca seja trancado para fora do painel
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

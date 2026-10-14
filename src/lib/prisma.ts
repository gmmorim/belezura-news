import { PrismaClient } from "@prisma/client";

// ============================================================================
// SINGLETON DO PRISMA CLIENT PARA AMBIENTE SERVERLESS (VERCEL + HOSTGATOR MYSQL)
// ============================================================================
// Em arquiteturas Serverless como a Vercel, cada execução pode instanciar um novo
// container Node.js efêmero. O padrão Singleton no objeto global impede a criação
// descontrolada de pools de conexões e previne o erro "Error 1040: Too many connections"
// no MySQL compartilhado da HostGator.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

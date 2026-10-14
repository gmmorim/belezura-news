import bcrypt from "bcryptjs";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import crypto from "crypto";

// ============================================================================
// PILAR 1: CRIPTOGRAFIA DE SENHAS (Argon2 / BCrypt com Salt Factor 12)
// ============================================================================

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Gera um hash criptograficamente seguro para a senha do usuário.
 * Protege contra ataques de dicionário e tabelas rainbow.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error("A senha deve conter no mínimo 8 caracteres.");
  }
  if (plainPassword.length > 72) {
    // Bcrypt trunca senhas maiores que 72 bytes; impedimos ataques de DoS por string gigante
    throw new Error("A senha excede o limite máximo de 72 caracteres.");
  }
  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS);
}

/**
 * Valida a senha informada contra o hash armazenado no banco com proteção timing-attack.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHash: string
): Promise<boolean> {
  if (!plainPassword || !storedHash) return false;
  return bcrypt.compare(plainPassword, storedHash);
}

// ============================================================================
// PILAR 3: SANITIZAÇÃO DE HTML & PREVENÇÃO DE XSS (Backend & Frontend)
// ============================================================================

/**
 * Configuração estrita de sanitização para artigos editoriais ricos.
 * Permite formatação rica de leitura, mas esteriliza scripts, iframes e atributos perigosos.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "figure",
    "figcaption",
    "img",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    "*": ["class"], // Permite estilização controlada
  },
  // Bloqueio rigoroso de esquemas como javascript:, data:, vbscript:
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  // Força atributos seguros em todos os links externos
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || "";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");

      return {
        tagName: "a",
        attribs: {
          ...attribs,
          ...(isExternal
            ? {
                target: "_blank",
                rel: "noopener noreferrer nofollow",
              }
            : {}),
        },
      };
    },
    img: (tagName, attribs) => ({
      tagName: "img",
      attribs: {
        ...attribs,
        loading: "lazy",
      },
    }),
  },
  // Remove completamente tags perigosas com todo o conteúdo interno
  nonTextTags: ["script", "style", "textarea", "option", "noscript", "iframe"],
};

/**
 * Higieniza o corpo de texto de uma postagem antes de persistir no banco de dados.
 */
export function sanitizePostContent(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return sanitizeHtml(dirtyHtml, SANITIZE_OPTIONS);
}

/**
 * Higieniza strings de texto simples (títulos, subtítulos, nomes) removendo qualquer tag HTML.
 */
export function sanitizePlainText(text: string): string {
  if (!text) return "";
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim();
}

/**
 * Escapa caracteres coringa em buscas de banco de dados (evita ReDoS / Full Table Scan)
 */
export function escapeSearchQuery(query: string): string {
  return query
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .trim();
}

/**
 * Schema Zod para validação rigorosa de entrada de novos Posts (Prevenção de Mass Assignment)
 */
export const PostSubmissionSchema = z.object({
  title: z.string().min(5, "O título deve ter no mínimo 5 caracteres").max(200),
  subtitle: z.string().max(350).optional(),
  category: z.string().min(2).max(50),
  author: z.string().min(2).max(100),
  imageWeb: z.string().url("A imagem web deve ser uma URL válida"),
  imageMobile: z.string().url("A imagem mobile deve ser uma URL válida").optional(),
  imageSourceText: z.string().max(120).optional(),
  imageSourceUrl: z.string().url().optional().or(z.literal("")),
  content: z.string().min(20, "O artigo deve ter no mínimo 20 caracteres"),
  tags: z.array(z.string().min(1).max(40)).max(15),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type ValidatedPostInput = z.infer<typeof PostSubmissionSchema>;

// ============================================================================
// PILAR 4: RATE LIMITING & PROTEÇÃO DE ENDPOINTS (Brute Force & Anti-DDoS)
// ============================================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// Armazenamento em memória com limpeza periódica (TTL)
const rateLimitCache = new Map<string, RateLimitRecord>();

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitCache.forEach((record, key) => {
      if (now > record.resetAt) {
        rateLimitCache.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Implementação de Sliding Window / Token Bucket para proteção de endpoints
 * @param key Identificador único (ex: `login:ip` ou `view:slug:ipHash`)
 * @param limit Número máximo de requisições permitidas na janela
 * @param windowSeconds Duração da janela temporal em segundos
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = rateLimitCache.get(key);

  if (!existing || now > existing.resetAt) {
    rateLimitCache.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: windowSeconds,
    };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - existing.count,
    resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/**
 * Anonimiza o IP do cliente com SHA-256 + Salt para conformidade total com LGPD/GDPR
 * Permite identificar abusadores sem salvar dados pessoais brutos no log ou banco.
 */
export function hashClientIp(rawIp: string): string {
  const salt = process.env.SECURITY_IP_SALT || "belezura-security-ip-salt-default";
  return crypto
    .createHmac("sha256", salt)
    .update(rawIp || "127.0.0.1")
    .digest("hex");
}

/** @type {import('next').NextConfig} */

// Content Security Policy (CSP) rigoroso para mitigar XSS, clickjacking e injeção de dados
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://uploadthing.com https://*.uploadthing.com https://*.ingest.uploadthing.com https://ufs.sh https://*.ufs.sh https://utfs.io https://*.amazonaws.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com;
  frame-ancestors 'none';
  form-action 'self' mailto:;
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const securityHeaders = [
  // 1. Content Security Policy (Prevenção de XSS e injeção de scripts)
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  // 2. Proteção Anti-Clickjacking (Impede iframe embedding)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // 3. Prevenção de MIME-Sniffing (Força navegador a respeitar Content-Type)
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 4. Referrer Policy (Privacidade de navegação ao transitar para links externos)
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 5. Permissions Policy (Desativa acesso a hardware e APIs sensíveis do dispositivo)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
  // 6. Strict Transport Security (HSTS - Força HTTPS estrito por 2 anos com subdomínios e preload)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 7. Otimização de Resolução DNS com Segurança
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // 8. Desativa XSS Auditor legado em favor da CSP moderna
  {
    key: "X-XSS-Protection",
    value: "0",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove header "X-Powered-By: Next.js" para evitar vazamento de fingerprint de tecnologia
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplica os cabeçalhos em todas as rotas da aplicação
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

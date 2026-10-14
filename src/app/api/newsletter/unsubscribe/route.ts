import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Token Inválido | Belezura News</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF9F6; color: #111; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: white; padding: 32px; border-radius: 20px; border: 1px solid #e5e5e5; max-width: 440px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
          h1 { color: #dc2626; font-size: 20px; margin-bottom: 12px; }
          p { color: #666; font-size: 14px; line-height: 1.6; }
          a { display: inline-block; margin-top: 20px; background: #ff6305; color: white; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-weight: bold; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Link Inválido ou Expirado</h1>
          <p>O token de cancelamento não foi informado ou não é mais válido. Se precisar de ajuda, envie um e-mail para contato@belezuranews.com.br.</p>
          <a href="/">Voltar ao Belezura News</a>
        </div>
      </body>
      </html>`,
      {
        status: 400,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  // Em produção com Prisma real:
  // await prisma.newsletterSubscriber.update({
  //   where: { unsubscribeToken: token },
  //   data: { isActive: false, unsubscribedAt: new Date() }
  // });

  return new NextResponse(
    `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Inscrição Cancelada | Belezura News</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF9F6; color: #111; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 24px; border: 1px solid #e5e5e5; max-width: 460px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        .badge { display: inline-block; background: #ff6305; color: white; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        h1 { font-size: 24px; margin-bottom: 12px; font-weight: 800; }
        p { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
        a { display: inline-block; background: #111; color: white; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 700; font-size: 13px; transition: opacity 0.2s; }
        a:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">Belezura Drops</span>
        <h1>Inscrição Cancelada com Sucesso</h1>
        <p>Você não receberá mais os e-mails diários do Belezura News. Sentiremos sua falta! Se quiser voltar a qualquer momento, basta assinar novamente pelo portal.</p>
        <a href="/">Retornar ao Portal</a>
      </div>
    </body>
    </html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
}

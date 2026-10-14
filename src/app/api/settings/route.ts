import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_CONFIGS: Record<string, string> = {
  footer_contact_email: "contato@belezuranews.com.br",
  footer_commercial_url: "mailto:comercial@belezuranews.com.br",
  newsletter_headline: "Receba o Belezura Drops toda manhã",
  newsletter_subheadline:
    "As principais tendências de beleza, moda e negócios no seu e-mail, de forma leve e descomplicada.",
  privacy_policy_text: `Política de Privacidade - Belezura News

Última atualização: Outubro de 2026.

1. Coleta de Informações: Coletamos apenas dados estritamente necessários para o funcionamento da plataforma e entrega de nossa newsletter, como endereço de e-mail e métricas de navegação anônimas.

2. Uso dos Dados: Seu e-mail é utilizado exclusivamente para o envio do compilado editorial Belezura Drops e avisos importantes sobre o portal. Não comercializamos seus dados em hipótese alguma com terceiros.

3. Cookies e Rastreamento: Utilizamos cookies técnicos para garantir a velocidade e usabilidade do site, além de mensurar audiência de forma agregada e em conformidade com a LGPD.

4. Seus Direitos (LGPD): A qualquer momento você pode solicitar o descadastro definitivo de nossa base de e-mails através do link presente no rodapé de cada edição ou entrando em contato com nosso Encarregado de Dados.`,
};

// Armazenamento em memória para resiliência caso o banco esteja inacessível
const memoryConfigs = { ...DEFAULT_CONFIGS };

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const result: Record<string, string> = { ...DEFAULT_CONFIGS, ...memoryConfigs };

    for (const item of configs) {
      result[item.key] = item.value;
    }

    return NextResponse.json({ success: true, configs: result });
  } catch (error) {
    console.warn("Aviso ao carregar siteConfig do banco (usando memória):", error);
    return NextResponse.json({ success: true, configs: memoryConfigs });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { configs } = body as { configs: Record<string, string> };

    if (!configs || typeof configs !== "object") {
      return NextResponse.json(
        { success: false, error: "Formato de dados inválido." },
        { status: 400 }
      );
    }

    // Atualiza memória
    for (const [key, val] of Object.entries(configs)) {
      memoryConfigs[key] = String(val);
    }

    // Persiste no Prisma
    try {
      const updates = Object.entries(configs).map(([key, value]) =>
        prisma.siteConfig.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      );
      await prisma.$transaction(updates);
    } catch (dbError) {
      console.warn("Aviso ao salvar siteConfig no banco:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Configurações salvas com sucesso!",
      configs: memoryConfigs,
    });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao atualizar configurações." },
      { status: 500 }
    );
  }
}

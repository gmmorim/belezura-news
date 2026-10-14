import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldAlert,
  ExternalLink,
  Mail,
  ArrowLeft,
  Sparkles,
  Stethoscope,
  Info,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | Belezura News",
  description:
    "Termos e condições gerais de uso do portal Belezura News. Informações sobre propriedade intelectual, isenção de responsabilidade e diretrizes editoriais.",
};

export default function TermosDeUsoPage() {
  return (
    <article className="w-full bg-[#FAF9F6] py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Link de Retorno */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#ff6305] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </Link>
        </div>

        {/* Cabeçalho Editorial da Página */}
        <header className="border-b border-neutral-200/80 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-[#ff6305]/10 text-[#ff6305]">
              <Scale className="w-5 h-5" />
            </span>
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Diretrizes & Condições Legais
            </span>
          </div>

          <h1 className="font-recoleta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 mb-4 leading-tight">
            Termos de Uso
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
            Bem-vindo(a) ao <strong>Belezura News</strong>. Ao acessar e utilizar o nosso portal, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
          </p>

          <div className="mt-4 text-xs text-neutral-400">
            Última atualização: Outubro de 2026
          </div>
        </header>

        {/* Conteúdo com Tailwind Typography (prose) */}
        <div className="prose prose-neutral sm:prose-lg max-w-none prose-headings:font-recoleta prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-bold prose-h2:text-neutral-950 prose-p:text-neutral-600 prose-p:leading-relaxed prose-strong:text-neutral-900 prose-strong:font-semibold prose-a:text-[#ff6305] prose-li:text-neutral-600">
          
          {/* Seção 1: Propriedade Intelectual */}
          <section className="space-y-3 mb-10">
            <h2 className="flex items-center gap-2.5 not-prose font-recoleta text-2xl sm:text-3xl font-bold text-neutral-950 mb-4">
              <span className="p-1 rounded-md bg-orange-50 text-[#ff6305]">
                <FileText className="w-5 h-5" />
              </span>
              <span>1. Propriedade Intelectual</span>
            </h2>

            <p>
              Todo o conteúdo publicado neste portal, incluindo textos, gráficos, logotipos, ícones, imagens (com exceção daquelas creditadas a bancos de imagens ou terceiros) e compilações de dados, é propriedade do <strong>Belezura News</strong> e protegido pelas leis de direitos autorais.
            </p>

            <div className="not-prose p-5 rounded-2xl bg-white border border-neutral-200/80 my-4 shadow-sm">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#ff6305] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Regra de Compartilhamento Autorizado
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    É proibida a reprodução total ou parcial do conteúdo sem autorização prévia, <strong>exceto</strong> através das ferramentas oficiais de compartilhamento (<em>Social Share</em>) disponibilizadas na própria página da matéria.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Natureza do Conteúdo e Isenção de Responsabilidade */}
          <section className="space-y-4 mb-10">
            <h2 className="flex items-center gap-2.5 not-prose font-recoleta text-2xl sm:text-3xl font-bold text-neutral-950 mb-4">
              <span className="p-1 rounded-md bg-orange-50 text-[#ff6305]">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <span>2. Natureza do Conteúdo e Isenção de Responsabilidade</span>
            </h2>

            <p>
              O <strong>Belezura News</strong> é um portal jornalístico e de entretenimento focado em novidades, beleza, negócios, moda e lifestyle.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#ff6305]">
                  <Stethoscope className="w-4 h-4" />
                  <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Reviews e Testes
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  As análises de produtos (como cosméticos e skincare) refletem a opinião e experiência da nossa redação. <strong>Elas não substituem a consulta a profissionais de saúde, como dermatologistas.</strong>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-[#ff6305]">
                  <Info className="w-4 h-4" />
                  <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Responsabilidade do Leitor
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  A aplicação de qualquer dica de beleza ou estilo de vida encontrada no site é de <strong>inteira responsabilidade do leitor</strong>. Recomendamos sempre a realização de teste de mecha ou teste alérgico prévio.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 3: Links para Terceiros */}
          <section className="space-y-3 mb-10">
            <h2 className="flex items-center gap-2.5 not-prose font-recoleta text-2xl sm:text-3xl font-bold text-neutral-950 mb-4">
              <span className="p-1 rounded-md bg-orange-50 text-[#ff6305]">
                <ExternalLink className="w-5 h-5" />
              </span>
              <span>3. Links para Terceiros</span>
            </h2>

            <p>
              O nosso portal pode conter links para sites de terceiros (como fontes jornalísticas, marcas citadas, referências acadêmicas ou parceiros). O <strong>Belezura News</strong> não tem controle e não assume responsabilidade pelo conteúdo, políticas de privacidade ou práticas de sites de terceiros.
            </p>
          </section>

          {/* Seção 4: Modificações dos Termos */}
          <section className="space-y-3 mb-10">
            <h2 className="flex items-center gap-2.5 not-prose font-recoleta text-2xl sm:text-3xl font-bold text-neutral-950 mb-4">
              <span className="p-1 rounded-md bg-orange-50 text-[#ff6305]">
                <Scale className="w-5 h-5" />
              </span>
              <span>4. Modificações dos Termos</span>
            </h2>

            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Quaisquer alterações entrarão em vigor imediatamente após a sua publicação oficial no portal. O uso continuado do serviço após a publicação das alterações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Seção 5: Contato */}
          <section className="not-prose pt-6 border-t border-neutral-200/80">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 text-white space-y-4">
              <div className="flex items-center gap-2 text-[#ff6305]">
                <Mail className="w-5 h-5" />
                <h2 className="font-alleron text-xs font-bold uppercase tracking-wider text-white">
                  5. Contato & Suporte Editorial
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                Para dúvidas sobre estes termos de uso, solicitações de autorização de reprodução ou propostas comerciais, entre em contato direto com a nossa equipe:
              </p>

              <div>
                <a
                  href="mailto:contato@belezuranews.com.br?subject=D%C3%BAvidas%20sobre%20os%20Termos%20de%20Uso"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ff6305] text-white font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>contato@belezuranews.com.br</span>
                </a>
              </div>

              <p className="text-[11px] text-neutral-400">
                Horário de atendimento editorial: Segunda a sexta, das 09h às 18h (Horário de Brasília).
              </p>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}

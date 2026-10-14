import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Mail, Cookie, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade & Proteção de Dados | Belezura News",
  description:
    "Transparência e conformidade com a Lei Geral de Proteção de Dados (LGPD). Saiba como tratamos dados de newsletter, cookies e como solicitar a exclusão de suas informações.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <article className="w-full bg-[#FAF9F6] py-10 sm:py-16">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Voltar para Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#ff6305] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Portal</span>
          </Link>
        </div>

        {/* Cabeçalho da Página */}
        <header className="border-b border-neutral-200/80 pb-8 mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-[#ff6305]/10 text-[#ff6305]">
              <Shield className="w-5 h-5" />
            </span>
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Conformidade LGPD (Lei nº 13.709/2018)
            </span>
          </div>

          <h1 className="font-recoleta text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 mb-4 leading-tight">
            Política de Privacidade & Termos de Uso
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
            No <strong>BELEZURA NEWS</strong>, valorizamos a transparência e a confiança de nossa comunidade. Esta política detalha de forma simples, clara e sem termos jurídicos obscuros como coletamos, tratamos e protegemos seus dados pessoais.
          </p>

          <div className="mt-4 text-xs text-neutral-400">
            Última atualização: {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </div>
        </header>

        {/* Conteúdo Estruturado */}
        <div className="space-y-12 text-neutral-800 leading-relaxed text-sm sm:text-base">
          
          {/* Seção 1: Identificação do Controlador */}
          <section className="space-y-3">
            <h2 className="font-recoleta text-2xl font-bold text-neutral-950 flex items-center gap-2">
              <span>1. Quem Somos & Controlador dos Dados</span>
            </h2>
            <p className="text-neutral-600">
              O portal <strong>Belezura News</strong> atua como Controlador no tratamento de seus dados pessoais, operando sob as diretrizes da Lei Geral de Proteção de Dados Pessoais (LGPD).
            </p>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 text-xs sm:text-sm space-y-1">
              <p><strong>Canal do Encarregado de Dados (DPO):</strong> Privacidade e Proteção</p>
              <p>
                <strong>E-mail de Contato:</strong>{" "}
                <a href="mailto:contato@belezuranews.com.br" className="text-[#ff6305] underline">
                  contato@belezuranews.com.br
                </a>
              </p>
            </div>
          </section>

          {/* Seção 2: Coleta de E-mails na Newsletter */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#ff6305]">
              <Mail className="w-5 h-5 shrink-0" />
              <h2 className="font-recoleta text-2xl font-bold text-neutral-950">
                2. Coleta de E-mails para a Newsletter (Belezura Drops)
              </h2>
            </div>
            
            <p className="text-neutral-600">
              Ao se cadastrar no <strong>Belezura Drops</strong> ou em nossos formulários de curadoria, coletamos exclusivamente o seu endereço de e-mail.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200/80">
                <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Finalidade Exclusiva
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Enviar periodicamente resumos editoriais, análises de mercado de beleza, moda, negócios e novidades selecionadas por nossa redação.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-neutral-200/80">
                <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Base Legal (Art. 7º, I da LGPD)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Tratamento fundamentado no seu consentimento expresso, livre e informado ao preencher os campos de assinatura voluntária.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200/60 text-xs sm:text-sm text-neutral-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#ff6305] shrink-0 mt-0.5" />
              <p>
                <strong>Compromisso Anti-Spam:</strong> Nós nunca venderemos, alugaremos ou compartilharemos sua lista de e-mails com parceiros ou agências de terceiros sem seu consentimento expresso.
              </p>
            </div>
          </section>

          {/* Seção 3: Cookies e Google Analytics 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#ff6305]">
              <Cookie className="w-5 h-5 shrink-0" />
              <h2 className="font-recoleta text-2xl font-bold text-neutral-950">
                3. Uso de Cookies e Google Analytics 4 (GA4)
              </h2>
            </div>

            <p className="text-neutral-600">
              Utilizamos cookies para assegurar o funcionamento da plataforma e compreender quais matérias despertam maior interesse de nossa comunidade:
            </p>

            <ul className="space-y-3 pl-4 border-l-2 border-neutral-200">
              <li>
                <strong>Cookies Estritamente Necessários:</strong> Garantem a estabilidade da página, segurança contra ataques de força bruta e persistência da sua escolha no banner de privacidade. Não podem ser desativados.
              </li>
              <li>
                <strong>Cookies Analíticos (Google Analytics 4):</strong> Coletam métricas de audiência totalmente anonimizadas (ex: tempo médio de permanência, páginas mais lidas e tipo de navegador). Operamos com o <em>Google Consent Mode v2</em>, que respeita imediatamente a opção do usuário ao clicar em &quot;Recusar Não Essenciais&quot;.
              </li>
            </ul>
          </section>

          {/* Seção 4: Direitos do Usuário e Exclusão de Dados */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[#ff6305]">
              <Trash2 className="w-5 h-5 shrink-0" />
              <h2 className="font-recoleta text-2xl font-bold text-neutral-950">
                4. Seus Direitos e Exclusão Imediata de Dados (Art. 18 LGPD)
              </h2>
            </div>

            <p className="text-neutral-600">
              Você detém o controle total sobre seus dados. A qualquer momento, sem burocracia, você pode exercer os seguintes direitos:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-neutral-200">
                <span className="font-bold text-neutral-900 block text-sm mb-1">Confirmação & Acesso</span>
                <span className="text-xs text-neutral-500">Saber quais dados mantemos sobre você em nossa base.</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-200">
                <span className="font-bold text-neutral-900 block text-sm mb-1">Revogação & Descadastro</span>
                <span className="text-xs text-neutral-500">Cancelar sua assinatura através do link presente em todos os e-mails.</span>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-200">
                <span className="font-bold text-neutral-900 block text-sm mb-1">Eliminação Completa</span>
                <span className="text-xs text-neutral-500">Solicitar a exclusão definitiva do seu e-mail de nossos servidores.</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900 text-white space-y-5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ff6305]" />
                <h3 className="font-alleron text-xs font-bold uppercase tracking-wider text-white">
                  Como Cancelar a Subscrição ou Excluir os Seus Dados
                </h3>
              </div>

              {/* Cancelamento Automático da Newsletter */}
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/60 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#ff6305] font-alleron">
                  Cancelamento Automático da Newsletter
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Para deixar de receber a nossa curadoria e cancelar a sua inscrição na Newsletter, basta clicar no link <strong>&quot;Descadastrar&quot;</strong> ou <strong>&quot;Unsubscribe&quot;</strong> disponível no rodapé de todos os e-mails que enviamos. O cancelamento é processado de forma automática e imediata.
                </p>
              </div>

              {/* Exclusão Definitiva de Registros (LGPD) */}
              <div className="p-4 rounded-xl bg-neutral-800/80 border border-neutral-700/60 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#ff6305] font-alleron">
                  Exclusão Definitiva de Dados (LGPD)
                </p>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Caso deseje a exclusão total e definitiva de qualquer registro associado ao seu e-mail na nossa base de dados (em conformidade com a LGPD), envie uma mensagem com o assunto <strong>&quot;Exclusão Definitiva de Dados&quot;</strong> para o nosso canal de privacidade:
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:contato@belezuranews.com.br?subject=Exclus%C3%A3o%20Definitiva%20de%20Dados"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff6305] text-white font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>contato@belezuranews.com.br</span>
                  </a>
                </div>
                <p className="text-[11px] text-neutral-400">
                  O nosso compromisso é concluir esta solicitação em até 48 horas úteis.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 5: Segurança da Informação */}
          <section className="space-y-3 border-t border-neutral-200/80 pt-8">
            <h2 className="font-recoleta text-2xl font-bold text-neutral-950">
              5. Segurança da Informação
            </h2>
            <p className="text-neutral-600">
              Adotamos medidas técnicas e organizacionais rígidas (incluindo criptografia em trânsito com HSTS/HTTPS, cabeçalhos de segurança estritos e hashing criptográfico de registros) para proteger suas informações contra acessos não autorizados, perdas ou incidentes de segurança.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

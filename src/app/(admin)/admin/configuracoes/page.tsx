"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  Briefcase,
  ShieldCheck,
  Sparkles,
  Save,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Eye,
} from "lucide-react";

export default function AdminConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
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
  });

  // Carregar dados salvos da API
  useEffect(() => {
    async function loadConfigs() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.configs) {
            setForm((prev) => ({
              ...prev,
              ...data.configs,
            }));
          }
        }
      } catch (err) {
        console.warn("Aviso ao buscar configurações da API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfigs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: form }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || "Erro ao salvar configurações.");
      }
    } catch {
      setErrorMessage("Erro de comunicação ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Deseja restaurar os textos e links padrão do Belezura News?")) {
      setForm({
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
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Módulo Restrito Admin
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#ff6305]" />
            <span>Configurações Vitais</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Gerencie textos do rodapé, contatos comerciais, chamadas da newsletter e política de privacidade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="font-alleron inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider border border-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Padrões</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="font-alleron inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Tudo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alertas de Sucesso / Erro */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 text-xs font-semibold animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Configurações vitais atualizadas e salvas com sucesso!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 flex items-center gap-2.5 text-xs font-semibold animate-fade-in shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-neutral-500 text-sm">
          Carregando configurações vitais...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* SEÇÃO 1: TEXTOS DO RODAPÉ & CANAIS */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
              <Mail className="w-5 h-5 text-[#ff6305]" />
              <div>
                <h2 className="font-recoleta text-lg font-bold text-white">
                  Textos do Rodapé & Contatos
                </h2>
                <p className="text-xs text-neutral-400">
                  Defina os endereços oficiais que aparecem no rodapé e no menu institucional.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  E-mail de Contato Editorial
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    name="footer_contact_email"
                    value={form.footer_contact_email}
                    onChange={handleChange}
                    placeholder="contato@belezuranews.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
                  />
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Exibido para sugestões de pauta e fale conosco.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Link / E-mail do Comercial
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    name="footer_commercial_url"
                    value={form.footer_commercial_url}
                    onChange={handleChange}
                    placeholder="mailto:comercial@belezuranews.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
                  />
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  Pode ser mailto:... ou URL direta para o Mídia Kit / WhatsApp.
                </span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: CHAMADA DA NEWSLETTER */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
              <Sparkles className="w-5 h-5 text-[#ff6305]" />
              <div>
                <h2 className="font-recoleta text-lg font-bold text-white">
                  Texto da Chamada da Newsletter
                </h2>
                <p className="text-xs text-neutral-400">
                  Headline e subheadline exibidas nos blocos de conversão do rodapé e nas matérias.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Título Principal da Chamada
                </label>
                <input
                  type="text"
                  name="newsletter_headline"
                  value={form.newsletter_headline}
                  onChange={handleChange}
                  placeholder="Receba o Belezura Drops toda manhã"
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Subtítulo de Apoio (Benefício para o Leitor)
                </label>
                <input
                  type="text"
                  name="newsletter_subheadline"
                  value={form.newsletter_subheadline}
                  onChange={handleChange}
                  placeholder="As principais tendências de beleza, moda e negócios no seu e-mail..."
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
                />
              </div>

              {/* Prévia Visual da Chamada */}
              <div className="pt-2">
                <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-[#ff6305]" /> Prévia de como aparecerá para o leitor:
                </span>
                <div className="p-5 rounded-2xl bg-[#FAF9F6] text-neutral-900 border border-neutral-300 shadow-sm">
                  <h4 className="font-recoleta text-xl font-bold text-neutral-950">
                    {form.newsletter_headline || "Título da Newsletter"}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    {form.newsletter_subheadline || "Subtítulo da newsletter"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: POLÍTICA DE PRIVACIDADE */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
            <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800">
              <ShieldCheck className="w-5 h-5 text-[#ff6305]" />
              <div>
                <h2 className="font-recoleta text-lg font-bold text-white">
                  Texto da Política de Privacidade (LGPD)
                </h2>
                <p className="text-xs text-neutral-400">
                  Texto legal que alimenta a página pública /politica-de-privacidade e o banner de cookies.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Conteúdo Oficial da Política
              </label>
              <textarea
                name="privacy_policy_text"
                rows={12}
                value={form.privacy_policy_text}
                onChange={handleChange}
                placeholder="Insira os termos da política de privacidade..."
                className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-mono text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] leading-relaxed"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Suporta parágrafos simples e quebras de linha.
              </span>
            </div>
          </div>

          {/* Barra de Ações Inferior */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="submit"
              disabled={saving}
              className="font-alleron inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <span>Salvando Dados...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Todas as Configurações</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

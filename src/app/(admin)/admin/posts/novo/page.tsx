"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileCheck,
  ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Tag as TagIcon,
  Smartphone,
  Globe,
  Radio,
  X,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { LivePreviewModal, PostFormData } from "@/components/admin/LivePreviewModal";

const CATEGORIES = ["Beauty", "Business", "Fashion", "Lifestyle", "Reviews"];

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="p-8 text-neutral-400">Carregando editor...</div>}>
      <NewPostForm />
    </Suspense>
  );
}

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados do Formulário
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    subtitle: "",
    category: "Beauty",
    author: "Helena Castro",
    date: new Date().toISOString().slice(0, 16),
    imageWeb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    imageSourceText: "Unsplash / Editorial",
    imageSourceUrl: "https://unsplash.com",
    content: "",
    tags: ["tendencias", "skincare"],
    status: "DRAFT",
  });

  const [tagInput, setTagInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [radarNotice, setRadarNotice] = useState<string | null>(null);

  // Estados de feedback assíncrono (Toast / Alertas)
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Efeito para preencher automaticamente quando vier do Radar Google News
  useEffect(() => {
    const radarTitle = searchParams.get("title");
    const radarCategory = searchParams.get("category");
    const radarSourceUrl = searchParams.get("sourceUrl");
    const radarSourceName = searchParams.get("sourceName");

    if (radarTitle) {
      setFormData((prev) => ({
        ...prev,
        title: radarTitle,
        category: radarCategory || prev.category,
        imageSourceText: radarSourceName ? `Referência: ${radarSourceName}` : prev.imageSourceText,
        imageSourceUrl: radarSourceUrl || prev.imageSourceUrl,
      }));
      setRadarNotice(
        `Pauta importada com sucesso do Radar Google News (${radarSourceName || "Veículo externo"}). Recomenda-se reescrever com o tom editorial único do Belezura News.`
      );
    }
  }, [searchParams]);

  // Manipulação de Tags
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean && !formData.tags.includes(clean)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, clean] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Salvar ou Publicar com persistência real na API e feedback visual
  const handleSubmit = async (targetStatus: "DRAFT" | "PUBLISHED") => {
    setSubmitError(null);

    // Validações imediatas de UX antes da chamada de rede
    if (!formData.title || formData.title.trim().length < 5) {
      setSubmitError("O título da matéria deve conter pelo menos 5 caracteres.");
      return;
    }

    if (!formData.content || formData.content.trim().length < 10) {
      setSubmitError("O conteúdo da matéria deve conter pelo menos 10 caracteres.");
      return;
    }

    if (!formData.imageWeb || !formData.imageWeb.startsWith("http")) {
      setSubmitError("A imagem de capa para Desktop deve ser uma URL válida (ex: https://images.unsplash.com/...).");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status: targetStatus,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedSuccess(true);
        setSuccessMessage(
          targetStatus === "PUBLISHED"
            ? "Matéria publicada com sucesso no portal!"
            : "Rascunho salvo com sucesso!"
        );
        setTimeout(() => {
          router.push("/admin/posts");
        }, 1500);
      } else {
        const errorMsg =
          data.error ||
          (data.details && JSON.stringify(data.details)) ||
          "Ocorreu um erro ao salvar a matéria no banco de dados.";
        setSubmitError(errorMsg);
      }
    } catch (err: any) {
      console.error("[SUBMIT_ERROR]", err);
      setSubmitError("Erro de comunicação com o servidor ao persistir a matéria. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-16">
      {/* Topo: Navegação de Retorno e Ações Principais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Nova Matéria
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Crie conteúdo editorial e visualize antes de publicar.
            </p>
          </div>
        </div>

        {/* Botão de Live Preview e Publicação */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Eye className="w-4 h-4 text-[#ff6305]" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("DRAFT")}
            className="hidden xs:inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
            ) : (
              <FileCheck className="w-4 h-4" />
            )}
            <span>{submitting ? "Salvando..." : "Salvar Rascunho"}</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("PUBLISHED")}
            className="font-alleron flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de Sucesso (Toast) */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 text-sm font-semibold animate-fade-in shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage} Redirecionando para a lista de matérias...</span>
        </div>
      )}

      {/* Alerta de Erro com Campo Específico (Toast) */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 flex items-start justify-between gap-3 text-sm animate-fade-in shadow-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300">Falha ao salvar a postagem:</p>
              <p className="text-xs text-red-200/90 mt-1 leading-relaxed">{submitError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-red-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alerta de Pauta Vinda do Radar Google News */}
      {radarNotice && (
        <div className="p-4 rounded-2xl bg-orange-950/40 border border-[#ff6305]/40 flex items-start justify-between gap-3 text-orange-200">
          <div className="flex items-start gap-3">
            <Radio className="w-5 h-5 text-[#ff6305] shrink-0 mt-0.5 animate-pulse" />
            <p className="text-xs leading-relaxed">{radarNotice}</p>
          </div>
          <button
            type="button"
            onClick={() => setRadarNotice(null)}
            className="text-orange-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Feedback de Sucesso */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">
            Matéria salva com sucesso no sistema! Redirecionando...
          </p>
        </div>
      )}

      {/* Formulário Dividido em Blocos Modulares */}
      <div className="space-y-6">
        {/* Bloco 1: Informações Principais & SEO */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Categoria */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Autor */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Autor da Publicação *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>

            {/* Data e Hora */}
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Data & Hora *
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>
          </div>

          {/* Título da Notícia */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Título Principal da Notícia *
              </label>
              <span className="text-[11px] text-neutral-500">
                {formData.title.length}/100 caracteres recomendados
              </span>
            </div>
            <input
              type="text"
              placeholder="Ex: A nova era do minimalismo botânico que está revolucionando o skincare..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl text-base sm:text-lg font-semibold text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>

          {/* Subtítulo / Linha Fina */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Subtítulo (Linha Fina de Destaque) *
            </label>
            <textarea
              rows={2}
              placeholder="Resumo envolvente que desperta a curiosidade do leitor..."
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>
        </div>

        {/* Bloco 2: Gestão de Imagens Responsivas (Web vs Mobile) & Créditos */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-[#ff6305]" />
            <h3 className="font-alleron text-xs font-bold uppercase tracking-widest text-white">
              Imagens & Créditos de Mídia
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Imagem Web (Desktop) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Imagem Web (Desktop 16:9 / 1600px) *
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageWeb}
                onChange={(e) =>
                  setFormData({ ...formData, imageWeb: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>

            {/* Imagem Mobile (Smartphones) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Imagem Mobile (Otimizada para smartphones) *
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageMobile}
                onChange={(e) =>
                  setFormData({ ...formData, imageMobile: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>

            {/* Fonte da Imagem (Texto) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Fonte da Imagem (Texto do Crédito) *
              </label>
              <input
                type="text"
                placeholder="Ex: Reprodução / Instagram @vogue"
                value={formData.imageSourceText}
                onChange={(e) =>
                  setFormData({ ...formData, imageSourceText: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>

            {/* Hyperlink da Fonte da Imagem */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Hyperlink da Fonte Original
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageSourceUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageSourceUrl: e.target.value })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Corpo do Texto & Editor */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Corpo do Texto Editorial *
            </label>
            <span className="text-[11px] text-neutral-500">
              Separe os parágrafos com linha em branco
            </span>
          </div>

          <textarea
            rows={12}
            placeholder="Escreva sua reportagem aqui com linguagem ágil e refinada..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] font-mono leading-relaxed"
          />
        </div>

        {/* Bloco 4: Tags & Indexação */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
            Tags da Matéria (Pressione Enter para adicionar)
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Ex: skincare, milao, maquiagem..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </div>

          {/* Lista de Tags Adicionadas */}
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs text-neutral-300"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400"
                  aria-label={`Remover tag ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Barra de Ação Fixa Inferior no Mobile para máxima ergonomia */}
        <div className="sm:hidden sticky bottom-4 z-30 p-3 rounded-2xl bg-neutral-900/95 backdrop-blur-md border border-neutral-800 shadow-xl flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex-1 py-3 rounded-xl bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-[#ff6305]" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("PUBLISHED")}
            className="flex-1 py-3 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de Live Preview Integrado */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formData}
        onPublish={() => {
          setPreviewOpen(false);
          handleSubmit("PUBLISHED");
        }}
      />
    </div>
  );
}

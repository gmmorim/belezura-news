"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileCheck,
  ImageIcon,
  Sparkles,
  Tag as TagIcon,
  Smartphone,
  Globe,
  Radio,
  X,
  Plus,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { LivePreviewModal, PostFormData } from "@/components/admin/LivePreviewModal";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { UploadDropzone } from "@/lib/uploadthing";

const CATEGORIES = ["Beauty", "Business", "Fashion", "Lifestyle", "Reviews"];

export function PostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Estados do Formulário
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    subtitle: "",
    category: "Beauty",
    author: "Redação Belezura",
    date: new Date().toISOString().slice(0, 16),
    imageWeb: "",
    imageMobile: "",
    imageSourceText: "",
    imageSourceUrl: "",
    content: "",
    tags: ["tendencias"],
    status: "DRAFT",
  });

  const [tagInput, setTagInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [radarNotice, setRadarNotice] = useState<string | null>(null);

  // Estados de Carregamento e Edição
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 1. CARREGAMENTO DOS DADOS PARA EDIÇÃO (Resolve o bug de campos vazios)
  useEffect(() => {
    if (!editId) return;

    let isMounted = true;
    async function loadPostToEdit() {
      setLoadingEditData(true);
      setSubmitError(null);
      try {
        const res = await fetch(`/api/posts/${editId}`);
        if (!res.ok) {
          throw new Error("Não foi possível carregar os dados desta matéria.");
        }
        const data = await res.json();
        if (data.success && data.post && isMounted) {
          setFormData({
            title: data.post.title || "",
            subtitle: data.post.subtitle || "",
            category: data.post.category || "Beauty",
            author: data.post.author || "Redação Belezura",
            date: data.post.date || new Date().toISOString().slice(0, 16),
            imageWeb: data.post.imageWeb || "",
            imageMobile: data.post.imageMobile || "",
            imageSourceText: data.post.imageSourceText || "",
            imageSourceUrl: data.post.imageSourceUrl || "",
            content: data.post.content || "",
            tags: data.post.tags || [],
            status: data.post.status || "DRAFT",
          });
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("[LOAD_EDIT_ERROR]", err);
          setSubmitError(err.message || "Erro ao carregar dados da matéria.");
        }
      } finally {
        if (isMounted) {
          setLoadingEditData(false);
        }
      }
    }

    loadPostToEdit();
    return () => {
      isMounted = false;
    };
  }, [editId]);

  // 2. Preenchimento via Radar Google News (Novo Post)
  useEffect(() => {
    if (editId) return;

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
        `Pauta importada do Radar Google News (${radarSourceName || "Veículo externo"}). Formate o conteúdo no tom editorial do Belezura News.`
      );
    }
  }, [searchParams, editId]);

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

  // Salvar (POST para novo post, PUT para edição)
  const handleSubmit = async (targetStatus: "DRAFT" | "PUBLISHED") => {
    setSubmitError(null);

    if (!formData.title || formData.title.trim().length < 5) {
      setSubmitError("O título da matéria deve conter pelo menos 5 caracteres.");
      return;
    }

    if (!formData.content || formData.content.trim().length < 10) {
      setSubmitError("O conteúdo da matéria deve conter pelo menos 10 caracteres.");
      return;
    }

    if (!formData.imageWeb) {
      setSubmitError("É obrigatório fazer o upload ou informar a imagem de capa para Desktop.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status: targetStatus,
      };

      const url = editId ? `/api/posts/${editId}` : "/api/posts";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSavedSuccess(true);
        setSuccessMessage(
          editId
            ? "Alterações salvas com sucesso!"
            : targetStatus === "PUBLISHED"
            ? "Matéria publicada com sucesso no portal!"
            : "Rascunho salvo com sucesso!"
        );
        setTimeout(() => {
          router.push("/admin/posts");
        }, 1200);
      } else {
        const errorMsg =
          data.error ||
          (data.details && JSON.stringify(data.details)) ||
          "Ocorreu um erro ao persistir a matéria.";
        setSubmitError(errorMsg);
      }
    } catch (err: any) {
      console.error("[SUBMIT_ERROR]", err);
      setSubmitError("Erro de comunicação com o servidor ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEditData) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#ff6305] animate-spin" />
        <p className="text-sm font-medium text-neutral-400">
          Carregando dados da matéria para edição...
        </p>
      </div>
    );
  }

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
              {editId ? "Editar Matéria" : "Nova Matéria"}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              {editId
                ? "Atualize as informações, fotos e texto editorial da publicação."
                : "Crie conteúdo editorial e visualize antes de publicar."}
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
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{editId ? "Salvar Alterações" : "Publicar"}</span>
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

      {/* Alerta de Erro */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/60 text-red-200 flex items-start justify-between gap-3 text-sm animate-fade-in shadow-2xl">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmitError(null)}
            className="text-red-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Aviso do Radar Google News */}
      {radarNotice && (
        <div className="p-4 rounded-2xl bg-orange-950/60 border border-[#ff6305]/40 text-orange-200 flex items-start justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-[#ff6305] shrink-0 mt-0.5 animate-pulse" />
            <span>{radarNotice}</span>
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

      {/* Grid de Edição: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Coluna Principal: Título, Subtítulo e Editor TipTap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Título da Matéria */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Título da Matéria <span className="text-[#ff6305]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: A ascensão do quiet luxury na alta perfumaria nacional..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-base sm:text-lg text-white font-medium placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>

          {/* Subtítulo / Linha Fina */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Linha Fina / Subtítulo (Opcional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Resumo afiado que instiga a leitura no feed e abaixo da manchete..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>

          {/* CORPO EDITORIAL: TIPTAP RICH TEXT EDITOR (Substitui o <textarea>) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Corpo do Texto Editorial <span className="text-[#ff6305]">*</span>
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">
                Editor Rico TipTap (HTML limpo)
              </span>
            </div>

            <TiptapEditor
              content={formData.content}
              onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
              placeholder="Redija aqui a matéria com cabeçalhos H2/H3, negrito, itálico, links e citações..."
            />
          </div>
        </div>

        {/* Coluna Lateral: Upload de Imagens (UploadThing), Categoria, Tags e Créditos */}
        <div className="space-y-6">
          {/* Editoria / Categoria */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Editoria Principal <span className="text-[#ff6305]">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* UPLOAD DE IMAGEM DESKTOP (UploadThing com Drag & Drop) */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#ff6305]" />
              <label className="block text-xs font-bold uppercase tracking-wider text-white">
                Imagem de Capa (Desktop) <span className="text-[#ff6305]">*</span>
              </label>
            </div>

            {formData.imageWeb ? (
              <div className="space-y-2">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950">
                  <img
                    src={formData.imageWeb}
                    alt="Preview Desktop"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageWeb: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                    title="Remover imagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">
                  {formData.imageWeb}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadDropzone
                  endpoint="postImageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                      setFormData((prev) => ({
                        ...prev,
                        imageWeb: res[0].url,
                        imageMobile: prev.imageMobile || res[0].url,
                      }));
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setSubmitError(`Erro no upload da imagem: ${error.message}`);
                  }}
                  className="border-neutral-800 bg-neutral-950/60 ut-label:text-[#ff6305] ut-button:bg-[#ff6305] ut-button:text-white rounded-xl py-6"
                />
                <input
                  type="url"
                  placeholder="Ou cole uma URL direta da imagem..."
                  value={formData.imageWeb}
                  onChange={(e) => setFormData({ ...formData, imageWeb: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#ff6305]"
                />
              </div>
            )}
          </div>

          {/* UPLOAD DE IMAGEM MOBILE (UploadThing Opcional) */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#ff6305]" />
              <label className="block text-xs font-bold uppercase tracking-wider text-white">
                Imagem Mobile (Opcional)
              </label>
            </div>

            {formData.imageMobile && formData.imageMobile !== formData.imageWeb ? (
              <div className="space-y-2">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950">
                  <img
                    src={formData.imageMobile}
                    alt="Preview Mobile"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageMobile: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                    title="Remover imagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <UploadDropzone
                  endpoint="postImageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                      setFormData((prev) => ({
                        ...prev,
                        imageMobile: res[0].url,
                      }));
                    }
                  }}
                  onUploadError={(error: Error) => {
                    setSubmitError(`Erro no upload mobile: ${error.message}`);
                  }}
                  className="border-neutral-800 bg-neutral-950/60 ut-label:text-[#ff6305] ut-button:bg-[#ff6305] ut-button:text-white rounded-xl py-6"
                />
              </div>
            )}
          </div>

          {/* Créditos da Imagem */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Crédito da Imagem
            </label>
            <input
              type="text"
              placeholder="Ex: Getty Images / Divulgação"
              value={formData.imageSourceText}
              onChange={(e) => setFormData({ ...formData, imageSourceText: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
            <input
              type="url"
              placeholder="Link da fonte (https://...)"
              value={formData.imageSourceUrl}
              onChange={(e) => setFormData({ ...formData, imageSourceUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>

          {/* Tags */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Tags Editoriais
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: skincare..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-[11px] font-medium text-neutral-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Live Preview */}
      <LivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formData}
      />
    </div>
  );
}

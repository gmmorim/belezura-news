"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileCheck,
  Smartphone,
  Globe,
  X,
  Plus,
  AlertCircle,
  Loader2,
  Trash2,
  User,
  Check,
} from "lucide-react";
import { LivePreviewModal, PostFormData } from "@/components/admin/LivePreviewModal";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { ControlledImageUpload } from "@/components/admin/ControlledImageUpload";

export interface PostCategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface PostAuthorOption {
  id: string;
  name: string;
  email: string;
}

interface PostFormProps {
  initialCategories?: PostCategoryOption[];
  initialAuthors?: PostAuthorOption[];
}

const DEFAULT_CATEGORIES: PostCategoryOption[] = [
  { id: "1", name: "Beauty", slug: "beauty" },
  { id: "2", name: "Fashion", slug: "fashion" },
  { id: "3", name: "Business", slug: "business" },
  { id: "4", name: "Lifestyle", slug: "lifestyle" },
  { id: "5", name: "Reviews", slug: "reviews" },
  { id: "6", name: "Entrevistas", slug: "entrevistas" },
];

export function PostForm({
  initialCategories = [],
  initialAuthors = [],
}: PostFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [categories, setCategories] = useState<PostCategoryOption[]>(
    initialCategories.length > 0 ? initialCategories : DEFAULT_CATEGORIES
  );
  const [authors, setAuthors] = useState<PostAuthorOption[]>(initialAuthors);

  // Integração com React Hook Form
  const methods = useForm<PostFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      category: initialCategories[0]?.name || "Beauty",
      author: initialAuthors[0]?.name || "Redação Belezura",
      authorId: initialAuthors[0]?.id || "",
      date: new Date().toISOString().slice(0, 16),
      imageWeb: "",
      imageMobile: "",
      imageSourceText: "",
      imageSourceUrl: "",
      content: "",
      tags: ["tendencias"],
      status: "DRAFT",
    },
  });

  const { setValue, watch, reset } = methods;
  const formData = watch();

  const [tagInput, setTagInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Estados de Carregamento e Edição
  const [loadingEditData, setLoadingEditData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Busca categorias se não vieram do servidor
  useEffect(() => {
    if (initialCategories.length === 0) {
      fetch("/api/categories")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
            setCategories(data.categories);
            if (!watch("category")) {
              setValue("category", data.categories[0].name, { shouldDirty: true });
            }
          }
        })
        .catch((err) => console.warn("Aviso ao carregar categorias dinâmicas:", err));
    }
  }, [initialCategories, setValue, watch]);

  // 1. CARREGAMENTO DOS DADOS PARA EDIÇÃO (Reset no React Hook Form)
  useEffect(() => {
    if (!editId) return;

    let isMounted = true;
    async function loadPostToEdit() {
      setLoadingEditData(true);
      setSubmitError(null);
      try {
        const res = await fetch(`/api/posts/${editId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Não foi possível carregar os dados desta matéria.");
        }
        const data = await res.json();
        if (data.success && data.post && isMounted) {
          reset({
            title: data.post.title || "",
            subtitle: data.post.subtitle || "",
            category: data.post.category || "Beauty",
            author: data.post.author || "Redação Belezura",
            authorId: data.post.authorId || "",
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
  }, [editId, reset]);

  // Manipulação de Tags com React Hook Form
  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, "");
    const currentTags = watch("tags") || [];
    if (clean && !currentTags.includes(clean)) {
      setValue("tags", [...currentTags, clean], { shouldValidate: true, shouldDirty: true });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = watch("tags") || [];
    setValue(
      "tags",
      currentTags.filter((t) => t !== tagToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  // Salvar (POST para novo post, PUT para edição)
  const handleSubmit = async (targetStatus: "DRAFT" | "PUBLISHED") => {
    setSubmitError(null);

    const currentValues = watch();

    if (!currentValues.title || currentValues.title.trim().length < 5) {
      setSubmitError("O título da matéria deve conter pelo menos 5 caracteres.");
      return;
    }

    if (!currentValues.content || currentValues.content.trim().length < 10) {
      setSubmitError("O conteúdo da matéria deve conter pelo menos 10 caracteres.");
      return;
    }

    if (!currentValues.imageWeb) {
      setSubmitError("É obrigatório fazer o upload ou informar a imagem de capa para Desktop.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...currentValues,
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
    <FormProvider {...methods}>
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
              value={formData.title || ""}
              onChange={(e) => setValue("title", e.target.value, { shouldValidate: true, shouldDirty: true })}
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
              value={formData.subtitle || ""}
              onChange={(e) => setValue("subtitle", e.target.value, { shouldValidate: true, shouldDirty: true })}
              placeholder="Resumo afiado que instiga a leitura no feed e abaixo da manchete..."
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
          </div>

          {/* CORPO EDITORIAL: TIPTAP RICH TEXT EDITOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                Corpo do Texto Editorial <span className="text-[#ff6305]">*</span>
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">
                Editor Rico TipTap (HTML limpo e responsivo)
              </span>
            </div>

            <TiptapEditor
              content={formData.content || ""}
              onChange={(html) => setValue("content", html, { shouldValidate: true, shouldDirty: true })}
              placeholder="Redija aqui a matéria com cabeçalhos H1/H2/H3/H4, fotos no texto, links e citações..."
            />
          </div>
        </div>

        {/* Coluna Lateral: Categorias Dinâmicas, Autores, Uploads, Tags */}
        <div className="space-y-6">
          {/* Editoria / Categoria Dinâmica */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Editoria Principal <span className="text-[#ff6305]">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setValue("category", e.target.value, { shouldValidate: true, shouldDirty: true })}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            >
              {categories.map((cat) => (
                <option key={cat.id || cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Autor / Quem Publicou */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#ff6305]" />
              <label className="block text-xs font-bold uppercase tracking-wider text-white">
                Autor / Quem Publicou <span className="text-[#ff6305]">*</span>
              </label>
            </div>

            {authors && authors.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={formData.authorId || ""}
                  onChange={(e) => {
                    const sel = authors.find((a) => a.id === e.target.value);
                    setValue("authorId", e.target.value, { shouldValidate: true, shouldDirty: true });
                    if (sel) {
                      setValue("author", sel.name, { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
                >
                  <option value="">Selecione o autor cadastrado...</option>
                  {authors.map((auth) => (
                    <option key={auth.id} value={auth.id}>
                      {auth.name} ({auth.email})
                    </option>
                  ))}
                </select>
                <div className="pt-1">
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Nome de exibição personalizado (opcional):
                  </label>
                  <input
                    type="text"
                    value={formData.author || ""}
                    onChange={(e) => setValue("author", e.target.value, { shouldValidate: true, shouldDirty: true })}
                    placeholder="Ex: Tom Candido ou Redação Belezura"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff6305]"
                  />
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={formData.author || ""}
                onChange={(e) => setValue("author", e.target.value, { shouldValidate: true, shouldDirty: true })}
                placeholder="Ex: Tom Candido ou Redação Belezura"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              />
            )}
            <p className="text-[11px] text-neutral-400">
              Assinatura na matéria: <span className="text-[#ff6305] font-semibold">{formData.author || "Redação Belezura"}</span>
            </p>
          </div>

          {/* UPLOAD DE IMAGEM DESKTOP (UploadThing Controlado) */}
          <ControlledImageUpload
            name="imageWeb"
            label="Imagem de Capa (Desktop)"
            required
            icon={<Globe className="w-4 h-4 text-[#ff6305]" />}
            aspectRatio="video"
            onUploadSuccess={(url) => {
              if (!watch("imageMobile")) {
                setValue("imageMobile", url, { shouldValidate: true, shouldDirty: true });
              }
              setSubmitError(null);
            }}
          />

          {/* UPLOAD DE IMAGEM MOBILE (UploadThing Controlado) */}
          <ControlledImageUpload
            name="imageMobile"
            label="Imagem Mobile (Opcional)"
            icon={<Smartphone className="w-4 h-4 text-[#ff6305]" />}
            aspectRatio="mobile"
            onUploadSuccess={() => {
              setSubmitError(null);
            }}
          />

          {/* Créditos da Imagem */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Crédito da Imagem
            </label>
            <input
              type="text"
              placeholder="Ex: Getty Images / Divulgação"
              value={formData.imageSourceText || ""}
              onChange={(e) => setValue("imageSourceText", e.target.value, { shouldValidate: true, shouldDirty: true })}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            />
            <input
              type="url"
              placeholder="Link da fonte (https://...)"
              value={formData.imageSourceUrl || ""}
              onChange={(e) => setValue("imageSourceUrl", e.target.value, { shouldValidate: true, shouldDirty: true })}
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
              {formData.tags && formData.tags.map((tag) => (
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
    </FormProvider>
  );
}

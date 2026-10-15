"use client";

import React, { useState } from "react";
import {
  Plus,
  Check,
  X,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@/components/admin/AlertDialog";
import {
  deleteCategory,
  createCategory,
  toggleCategoryStatusAction,
} from "@/app/actions/categories";

export interface CategoryItemData {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  postsCount: number;
}

interface CategoriesManagerProps {
  initialCategories: CategoryItemData[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<CategoryItemData[]>(initialCategories);
  const [newCatName, setNewCatName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Estados de Exclusão (AlertDialog)
  const [deleteTarget, setDeleteTarget] = useState<CategoryItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Visual (Toast / Notificação)
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Alternar Status de Exibição
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Otimista
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: nextStatus } : c))
    );

    const res = await toggleCategoryStatusAction(id, nextStatus);
    if (!res.success) {
      // Reverte em caso de falha
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
      );
      setFeedback({
        type: "error",
        message: res.error || "Não foi possível atualizar o status da categoria.",
      });
    }
  };

  // Criar Categoria
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsCreating(true);
    setFeedback(null);

    try {
      const res = await createCategory(newCatName.trim());
      if (res.success && res.category) {
        const createdItem: CategoryItemData = {
          id: res.category.id,
          name: res.category.name,
          slug: res.category.slug,
          order: res.category.order,
          isActive: res.category.isActive,
          postsCount: 0,
        };

        setCategories((prev) => [...prev, createdItem]);
        setNewCatName("");
        setShowAddForm(false);
        setFeedback({
          type: "success",
          message: res.message || "Categoria cadastrada com sucesso!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Erro ao criar categoria.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Erro de conexão ao criar categoria.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Confirmar Exclusão com Tratamento de Restrição de Integridade (Foreign Key)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setFeedback(null);

    try {
      const res = await deleteCategory(deleteTarget.id);

      if (res.success) {
        // Remove da lista na tela imediatamente
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setFeedback({
          type: "success",
          message: `A categoria "${deleteTarget.name}" foi excluída com sucesso!`,
        });
      } else {
        // Exibe mensagem de erro (incluindo regra de foreign key P2003 / posts vinculados)
        setFeedback({
          type: "error",
          message: res.error || "Não foi possível excluir a categoria.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message:
          err.message || "Erro inesperado ao excluir categoria. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Topo / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Módulo Restrito Admin
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Categorias & Menu da Header
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Controle as editorias exibidas na navegação e a hierarquia dos conteúdos editoriais.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFeedback(null);
          }}
          className="font-alleron self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Alerta de Feedback (Sucesso ou Erro) */}
      {feedback && (
        <div
          className={cn(
            "p-4 rounded-2xl border flex items-start justify-between gap-3 text-sm animate-fade-in shadow-xl",
            feedback.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
              : "bg-red-950/90 border-red-500/60 text-red-200"
          )}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <span className="font-medium leading-relaxed">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Formulário Rápido de Adição */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCategory}
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in"
        >
          <input
            type="text"
            required
            placeholder="Nome da categoria (ex: Sustentabilidade, Luxo, Wellness)..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            disabled={isCreating}
            className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] disabled:opacity-50"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isCreating}
              className="font-alleron flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar</span>
              )}
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Categorias com Contagem Real, Toggle e Botão de Excluir */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
        {categories.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm flex flex-col items-center gap-3">
            <FolderTree className="w-8 h-8 text-neutral-600" />
            <p>Nenhuma categoria cadastrada no banco de dados.</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-colors"
            >
              {/* Informações da Categoria */}
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-neutral-800 text-neutral-300 font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-neutral-700/60">
                  {cat.order}
                </span>
                <div className="min-w-0">
                  <p className="font-alleron text-sm font-bold uppercase tracking-wider text-white truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-neutral-400 font-mono">/{cat.slug}</p>
                </div>
              </div>

              {/* Estatísticas, Status e Ação de Excluir */}
              <div className="flex items-center justify-between sm:justify-end gap-3.5 pl-11 sm:pl-0">
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg font-medium",
                    cat.postsCount > 0
                      ? "bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                      : "bg-neutral-950 text-neutral-500"
                  )}
                  title={`${cat.postsCount} matérias publicadas nesta categoria`}
                >
                  <strong className="text-white font-bold">{cat.postsCount}</strong>{" "}
                  {cat.postsCount === 1 ? "matéria vinculada" : "matérias vinculadas"}
                </span>

                {/* Botão de Toggle Ativo no Menu */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(cat.id, cat.isActive)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors",
                    cat.isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                      : "bg-neutral-800 text-neutral-500 border border-neutral-700 hover:text-neutral-300"
                  )}
                  title={
                    cat.isActive
                      ? "Visível na navegação da Header"
                      : "Oculto da navegação"
                  }
                >
                  {cat.isActive ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                  <span>{cat.isActive ? "No Menu" : "Oculto"}</span>
                </button>

                {/* Botão de Excluir Categoria (com confirmação e foreign key check) */}
                <button
                  type="button"
                  onClick={() => setDeleteTarget(cat)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30"
                  title={`Excluir categoria "${cat.name}"`}
                  aria-label={`Excluir categoria "${cat.name}"`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Confirmação de Exclusão (AlertDialog com Proteção) */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Matérias vinculadas a ela não podem ser deletadas em cascata por motivos de segurança editorial."
        itemBadge={deleteTarget ? `${deleteTarget.name} (/${deleteTarget.slug})` : undefined}
        confirmLabel="Sim, excluir categoria"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
}

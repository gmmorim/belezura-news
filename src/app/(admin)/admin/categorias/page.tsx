"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Plus,
  ArrowUpDown,
  Check,
  X,
  Edit2,
  Trash2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryAdminItem {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  postsCount: number;
}

const INITIAL_CATEGORIES: CategoryAdminItem[] = [
  { id: "1", name: "Beauty", slug: "beauty", order: 1, isActive: true, postsCount: 42 },
  { id: "2", name: "Fashion", slug: "fashion", order: 2, isActive: true, postsCount: 38 },
  { id: "3", name: "Business", slug: "business", order: 3, isActive: true, postsCount: 29 },
  { id: "4", name: "Lifestyle", slug: "lifestyle", order: 4, isActive: true, postsCount: 24 },
  { id: "5", name: "Reviews", slug: "reviews", order: 5, isActive: true, postsCount: 15 },
  { id: "6", name: "Entrevistas", slug: "entrevistas", order: 6, isActive: true, postsCount: 0 },
];

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<CategoryAdminItem[]>(INITIAL_CATEGORIES);
  const [newCatName, setNewCatName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCat: CategoryAdminItem = {
      id: String(Date.now()),
      name: newCatName.trim(),
      slug,
      order: categories.length + 1,
      isActive: true,
      postsCount: 0,
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
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
            Controle as editorias exibidas na navegação e a hierarquia dos conteúdos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="font-alleron self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Formulário Rápido de Adição */}
      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
        >
          <input
            type="text"
            placeholder="Nome da categoria (ex: Sustentabilidade, Luxo)..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Categorias com Reordenação e Status */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-neutral-800 text-neutral-400 font-mono text-xs flex items-center justify-center font-bold">
                {cat.order}
              </span>
              <div>
                <p className="font-alleron text-sm font-bold uppercase tracking-wider text-white">
                  {cat.name}
                </p>
                <p className="text-xs text-neutral-500">Slug: /{cat.slug}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 pl-10 sm:pl-0">
              <span className="text-xs text-neutral-400">
                {cat.postsCount} matérias vinculadas
              </span>

              {/* Botão de Toggle Ativo no Menu */}
              <button
                type="button"
                onClick={() => toggleCategoryStatus(cat.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors",
                  cat.isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                )}
              >
                {cat.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                <span>{cat.isActive ? "No Menu" : "Oculto"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

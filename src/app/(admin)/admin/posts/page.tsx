"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PostItem {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "PUBLISHED" | "DRAFT";
  views: number;
  date: string;
  image: string;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: "1",
    title: "A nova era do minimalismo botânico: o ingrediente que está revolucionando o skincare de luxo.",
    category: "Beauty",
    author: "Helena Castro",
    status: "PUBLISHED",
    views: 1420,
    date: "13 Out 2026",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Fusões milionárias: gigantes de cosméticos aceleram aquisições no Brasil.",
    category: "Business",
    author: "Lucas Ferreira",
    status: "PUBLISHED",
    views: 890,
    date: "13 Out 2026",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Testamos o protetor solar com efeito primer que virou febre no TikTok.",
    category: "Reviews",
    author: "Mariana Costa",
    status: "DRAFT",
    views: 0,
    date: "12 Out 2026",
    image: "https://images.unsplash.com/photo-1512290900672-1f4864459f3c?q=80&w=300&auto=format&fit=crop",
  },
];

export default function PostsAdminListPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((p) => {
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header da Listagem */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Gestão Editorial
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Todas as Postagens
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/radar"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-[#ff6305]" />
            <span>Radar Google</span>
          </Link>

          <Link
            href="/admin/posts/novo"
            className="font-alleron inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Nova Matéria</span>
          </Link>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor ou editoria..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
          />
        </div>

        {/* Abas de Status */}
        <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
          {[
            { id: "ALL", label: "Todas" },
            { id: "PUBLISHED", label: "Publicadas" },
            { id: "DRAFT", label: "Rascunhos" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                filterStatus === tab.id
                  ? "bg-[#ff6305] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista Responsiva de Posts (Cards Mobile / Tabela Desktop) */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            Nenhuma matéria encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cover bg-center shrink-0 border border-neutral-800"
                  style={{ backgroundImage: `url('${post.image}')` }}
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-alleron text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {post.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {post.status === "PUBLISHED" ? "Publicada" : "Rascunho"}
                    </span>
                    <span className="text-[11px] text-neutral-500">{post.date}</span>
                  </div>

                  <h3 className="font-sans text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400">Por {post.author}</p>
                </div>
              </div>

              {/* Estatísticas e Ações Rápidas */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                <div className="text-xs text-neutral-400 sm:text-right pr-2">
                  <span className="text-neutral-500">Visualizações: </span>
                  <span className="font-semibold text-white">{post.views.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/novo?edit=${post.id}`}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Editar Matéria"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Ver no Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

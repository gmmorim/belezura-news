"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  FileText,
  FolderTree,
  Mail,
  Users,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  PlusCircle,
  ShieldCheck,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Radar Google News",
    href: "/admin/radar",
    icon: Radio,
    badge: "Ao Vivo",
  },
  { label: "Postagens", href: "/admin/posts", icon: FileText },
  { label: "Categorias & Menus", href: "/admin/categorias", icon: FolderTree, adminOnly: true },
  { label: "Inscritos Newsletter", href: "/admin/newsletter", icon: Mail, adminOnly: true },
  { label: "Equipe & Acessos", href: "/admin/usuarios", icon: Users, adminOnly: true },
  { label: "Configurações Vitais", href: "/admin/configuracoes", icon: Settings, adminOnly: true },
];

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Simulação de usuário autenticado (Role: ADMIN)
  const currentUser = {
    name: "Helena Castro",
    email: "helena@belezuranews.com.br",
    role: "ADMIN" as const, // Alternar para REDATOR em testes
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* ------------------------------------------------------------- */}
      {/* HEADER MOBILE (STICKY TOP 56px COM TOUCH TARGET OTIMIZADO) */}
      {/* ------------------------------------------------------------- */}
      <header className="md:hidden sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-800 text-neutral-200 hover:text-white active:bg-neutral-700 transition-colors"
            aria-label="Abrir menu do painel"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/admin" className="flex items-center gap-1.5">
            <span className="font-recoleta text-xl font-bold text-white">Belezura</span>
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305] bg-[#ff6305]/10 px-2 py-0.5 rounded-md border border-[#ff6305]/20">
              CMS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts/novo"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff6305] text-white hover:bg-orange-600 transition-colors shadow-sm"
            aria-label="Criar Novo Post"
          >
            <PlusCircle className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            target="_blank"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Ver portal ao vivo"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR DESKTOP PERMANENTE (MODERNO DARK COM BORDAS SUTIS) */}
      {/* ------------------------------------------------------------- */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-neutral-900 border-r border-neutral-800 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-recoleta text-2xl font-bold text-white tracking-tight">
              Belezura
            </span>
            <span className="font-alleron text-sm font-extrabold uppercase tracking-widest text-[#ff6305]">
              CMS
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Ver Portal Ao Vivo"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {/* CTA Rápido de Criação */}
        <div className="p-4">
          <Link
            href="/admin/posts/novo"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ff6305] text-white font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar Nova Matéria</span>
          </Link>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-[#ff6305]/15 text-[#ff6305] font-semibold border border-[#ff6305]/30"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-[#ff6305]" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff6305] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Perfil do Usuário Logado */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[#ff6305]/20 border border-[#ff6305]/30 flex items-center justify-center text-[#ff6305] font-bold text-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  {currentUser.role === "ADMIN" ? (
                    <ShieldCheck className="w-3 h-3 text-[#ff6305]" />
                  ) : (
                    <PenTool className="w-3 h-3 text-neutral-400" />
                  )}
                  <span className="uppercase font-bold tracking-wider text-[9px] text-[#ff6305]">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
              title="Sair do Painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* DRAWER SIDEBAR MOBILE (OFF-CANVAS COM FRAME MOTION) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Painel Off-Canvas */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-[85vw] bg-neutral-900 h-full border-r border-neutral-800 flex flex-col z-10 shadow-2xl"
            >
              {/* Header do Drawer */}
              <div className="p-4 flex items-center justify-between border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <span className="font-recoleta text-xl font-bold text-white">Belezura</span>
                  <span className="font-alleron text-xs font-bold uppercase tracking-wider text-[#ff6305]">
                    CMS
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Botão Novo Post no Mobile */}
              <div className="p-4">
                <Link
                  href="/admin/posts/novo"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#ff6305] text-white font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Criar Nova Matéria</span>
                </Link>
              </div>

              {/* Lista de Navegação Mobile */}
              <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#ff6305]/15 text-[#ff6305] font-semibold border border-[#ff6305]/30"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-[#ff6305]" : "text-neutral-400"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff6305] text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Perfil no Mobile */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <span className="text-[9px] uppercase font-bold text-[#ff6305]">
                    {currentUser.role}
                  </span>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-[11px] text-neutral-300 font-medium flex items-center gap-1"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL DO PAINEL */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

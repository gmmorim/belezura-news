"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  PenTool,
  Plus,
  Mail,
  UserCheck,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@/components/admin/AlertDialog";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "REDATOR";
  postsCount: number;
  joinedDate: string;
}

export default function AdminUsuariosPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "REDATOR" as "ADMIN" | "REDATOR",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Estados de Exclusão (AlertDialog) e Toast
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carrega lista atualizada de usuários da API Prisma
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.users)) {
            setTeam(data.users);
          }
        }
      } catch (err) {
        console.warn("Aviso ao carregar usuários da API:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Cadastrar novo membro via POST /api/users
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    setIsCreating(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTeam((prev) => [
          {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            postsCount: 0,
            joinedDate: "Hoje",
          },
          ...prev,
        ]);
        setToast({
          type: "success",
          text: `Membro ${data.user.name} adicionado com sucesso!`,
        });
        setNewMember({ name: "", email: "", role: "REDATOR" });
        setShowInviteModal(false);
      } else {
        setToast({
          type: "error",
          text: data.error || "Falha ao cadastrar membro da redação.",
        });
      }
    } catch {
      setToast({
        type: "error",
        text: "Erro de comunicação ao salvar usuário. Tente novamente.",
      });
    } finally {
      setIsCreating(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  // Confirmar Exclusão via DELETE /api/users/[id]
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTeam((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        setToast({
          type: "success",
          text: `Usuário "${deleteTarget.name}" (${deleteTarget.email}) foi removido com sucesso.`,
        });
      } else {
        setToast({
          type: "error",
          text:
            data.error ||
            "Não foi possível remover o usuário. Apenas administradores podem executar esta ação.",
        });
      }
    } catch (err) {
      console.error("[DELETE_USER_FRONTEND_ERROR]", err);
      setToast({
        type: "error",
        text: "Erro de conexão ao tentar remover usuário. Tente novamente.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setTimeout(() => setToast(null), 5000);
    }
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
            Equipe & Permissões (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Gestão dos papéis de acesso à redação: Administrador (Acesso total) vs Redator (Esteira editorial).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="font-alleron self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Membro</span>
        </button>
      </div>

      {/* Toast de Notificação (Sucesso ou Erro 403) */}
      {toast && (
        <div
          className={cn(
            "p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm animate-fade-in shadow-xl",
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
              : "bg-red-950/90 border-red-500/60 text-red-200"
          )}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{toast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Guia de Papéis de Negócio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ff6305]" />
            <h3 className="font-alleron text-xs font-bold uppercase tracking-widest text-white">
              Papel: ADMIN
            </h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Acesso total ao sistema. Modifica menus da header, gerencia categorias, cadastra/remove usuários, altera textos vitais e exporta leads da newsletter.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-400" />
            <h3 className="font-alleron text-xs font-bold uppercase tracking-widest text-white">
              Papel: REDATOR
            </h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Focado na esteira de conteúdo. Criação e edição de postagens e uso do simulador de Live Preview.
          </p>
        </div>
      </div>

      {/* Modal/Formulário de Cadastro */}
      {showInviteModal && (
        <form
          onSubmit={handleAddMember}
          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4"
        >
          <h3 className="font-sans text-sm font-bold text-white">
            Adicionar Novo Membro da Redação
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome completo..."
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              required
            />
            <input
              type="email"
              placeholder="E-mail profissional..."
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
              required
            />
            <select
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value as "ADMIN" | "REDATOR" })
              }
              className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ff6305]"
            >
              <option value="REDATOR">REDATOR (CMS & Pautas)</option>
              <option value="ADMIN">ADMIN (Acesso Total)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="font-alleron px-5 py-2.5 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isCreating ? "Salvando..." : "Confirmar Cadastro"}</span>
            </button>
            <button
              type="button"
              disabled={isCreating}
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista da Equipe */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden divide-y divide-neutral-800">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 text-sm flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-[#ff6305] animate-spin" />
            <span>Carregando membros da equipe...</span>
          </div>
        ) : team.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-sm">
            Nenhum membro encontrado.
          </div>
        ) : (
          team.map((member) => (
          <div
            key={member.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-800/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-snug">{member.name}</p>
                <p className="text-xs text-neutral-400">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-14 sm:pl-0">
              <span className="text-xs text-neutral-400 hidden xs:inline">
                {member.postsCount} matérias publicadas
              </span>

              <span
                className={cn(
                  "font-alleron px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  member.role === "ADMIN"
                    ? "bg-[#ff6305]/15 text-[#ff6305] border-[#ff6305]/30"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                )}
              >
                {member.role}
              </span>

              {/* Botão de Excluir Usuário (Apenas ADMIN com confirmação) */}
              <button
                type="button"
                onClick={() => setDeleteTarget(member)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                title={`Remover ${member.name}`}
                aria-label={`Remover ${member.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )))}
      </div>

      {/* Modal de Confirmação de Exclusão de Usuário (AlertDialog) */}
      <AlertDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remover Utilizador"
        description="Tem a certeza de que deseja remover este utilizador? O acesso será revogado imediatamente."
        itemBadge={deleteTarget ? `${deleteTarget.name} (${deleteTarget.email}) - Papel: ${deleteTarget.role}` : undefined}
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
      />
    </div>
  );
}

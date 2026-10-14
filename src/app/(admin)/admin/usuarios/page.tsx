"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  PenTool,
  Plus,
  Mail,
  UserCheck,
  Trash2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "REDATOR";
  postsCount: number;
  joinedDate: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Helena Castro",
    email: "helena@belezuranews.com.br",
    role: "ADMIN",
    postsCount: 68,
    joinedDate: "Março 2026",
  },
  {
    id: "2",
    name: "Lucas Ferreira",
    email: "lucas@belezuranews.com.br",
    role: "REDATOR",
    postsCount: 44,
    joinedDate: "Maio 2026",
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mariana@belezuranews.com.br",
    role: "REDATOR",
    postsCount: 36,
    joinedDate: "Junho 2026",
  },
];

export default function AdminUsuariosPage() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "REDATOR" as "ADMIN" | "REDATOR" });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    setTeam([
      ...team,
      {
        id: String(Date.now()),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        postsCount: 0,
        joinedDate: "Hoje",
      },
    ]);

    setNewMember({ name: "", email: "", role: "REDATOR" });
    setShowInviteModal(false);
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
            Focado na esteira de conteúdo. Acesso ao Radar Google News, criação e edição de postagens e uso do simulador de Live Preview.
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
              className="font-alleron px-5 py-2.5 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors"
            >
              Confirmar Cadastro
            </button>
            <button
              type="button"
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
        {team.map((member) => (
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

            <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
              <span className="text-xs text-neutral-400">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

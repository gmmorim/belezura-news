"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminPerfilPage() {
  const { data: session, update: updateSession } = useSession();

  const [name, setName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Inicializa os campos com os dados da sessão ativa
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setCurrentEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    // Validações no cliente
    if (newPassword) {
      if (newPassword.length < 6) {
        setToast({
          type: "error",
          message: "A nova senha deve possuir no mínimo 6 caracteres.",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setToast({
          type: "error",
          message: "A confirmação da nova senha não confere.",
        });
        return;
      }
    }

    if (newEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newEmail.trim())) {
        setToast({
          type: "error",
          message: "Por favor, informe um endereço de novo e-mail válido.",
        });
        return;
      }
    }

    // Se nenhum campo de alteração foi preenchido
    if (!newEmail && !newPassword && name === (session?.user?.name || "")) {
      setToast({
        type: "error",
        message: "Nenhuma alteração foi informada para salvar.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() !== session?.user?.name ? name.trim() : undefined,
          email: newEmail ? newEmail.trim() : undefined,
          password: newPassword ? newPassword : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Falha ao salvar alterações do perfil.");
      }

      // Sucesso na atualização
      setToast({
        type: "success",
        message: "Credenciais de acesso e perfil atualizados com sucesso!",
      });

      // Atualiza os estados locais
      if (newEmail) {
        setCurrentEmail(newEmail.trim());
        setNewEmail("");
      }
      setNewPassword("");
      setConfirmPassword("");

      // Atualiza o estado da sessão NextAuth
      if (updateSession) {
        await updateSession({
          name: data.user.name,
          email: data.user.email,
        });
      }
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      setToast({
        type: "error",
        message: err.message || "Erro inesperado ao salvar alterações.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userRole = ((session?.user as any)?.role as string) || "REDATOR";

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-alleron text-xs font-bold uppercase tracking-widest text-[#ff6305]">
              Gestão de Acesso
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ff6305]/10 text-[#ff6305] border border-[#ff6305]/20">
              {userRole}
            </span>
          </div>
          <h1 className="font-recoleta text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Configurações da Conta
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-light">
            Altere seu e-mail de acesso institucional e redefina sua senha de autenticação no painel.
          </p>
        </div>
      </div>

      {/* Banner de Feedback Interativo (Toast) */}
      {toast && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 border transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/40 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium leading-relaxed">
            {toast.message}
          </div>
        </div>
      )}

      {/* Card do Formulário de Perfil */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bloco 1: Identificação do Usuário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Nome de Exibição</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Nível de Acesso (Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Nível de Permissão (Role)</span>
                </label>
                <div className="px-4 py-2.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl text-sm text-neutral-400 flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider text-xs text-[#ff6305]">
                    {userRole}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Definido pela Diretoria
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-800/80 my-2" />

            {/* Bloco 2: Gestão de E-mail */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#ff6305]" />
                <span>Credenciais de E-mail</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* E-mail Atual (Desabilitado/Informativo) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    E-mail Atual de Acesso
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={currentEmail}
                      disabled
                      className="w-full px-4 py-2.5 bg-neutral-950/50 border border-neutral-800/80 rounded-xl text-sm text-neutral-400 cursor-not-allowed"
                    />
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  </div>
                </div>

                {/* Novo E-mail */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Novo E-mail (Opcional)
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="novo.email@belezuranews.com.br"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                  />
                  <span className="text-[11px] text-neutral-500 block">
                    Deixe em branco se deseja manter o e-mail atual.
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-neutral-800/80 my-2" />

            {/* Bloco 3: Redefinição de Senha */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#ff6305]" />
                  <span>Segurança & Senha</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar caracteres</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver caracteres</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Nova Senha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Nova Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                  />
                </div>

                {/* Confirmar Nova Senha */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <span className="text-[11px] text-neutral-500 block">
                Preencha apenas se desejar redefinir sua senha de acesso. A nova senha será criptografada com algoritmo Bcrypt antes de ser salva no banco de dados.
              </span>
            </div>

            {/* Rodapé com Botão Salvar */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff6305] text-white font-alleron text-xs font-bold uppercase tracking-wider hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-500/20 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando Alterações...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

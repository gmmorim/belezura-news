"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0e0e10] flex items-center justify-center text-neutral-400">Carregando portal de acesso...</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    urlError === "unauthorized_role"
      ? "Seu perfil não possui autorização para a rota solicitada."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage("E-mail ou senha incorretos. Verifique suas credenciais.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setErrorMessage("Ocorreu um erro ao conectar ao serviço de autenticação.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#ff6305] selection:text-white">
      {/* Background Glows Editoriais */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6305]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-neutral-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Voltar para Home Pública */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-neutral-900/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Portal</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Identidade Visual da Marca */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex items-baseline justify-center gap-2 group select-none">
            <span className="font-recoleta text-4xl sm:text-5xl font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
              Belezura
            </span>
            <span className="font-alleron text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-[#ff6305]">
              News
            </span>
          </Link>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 mt-2">
              <Lock className="w-3 h-3 text-[#ff6305]" />
              <span>CMS Editorial & Gestão</span>
            </span>
          </div>
        </div>

        {/* Card do Formulário */}
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
          <h1 className="font-recoleta text-2xl font-bold text-white mb-1">
            Acesso Restrito
          </h1>
          <p className="text-xs text-neutral-400 mb-6">
            Entre com suas credenciais de Redator ou Administrador para gerenciar o portal.
          </p>

          {/* Banner de Erro */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo E-mail */}
            <div className="space-y-1.5">
              <label className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@belezuranews.com.br"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5">
              <label className="font-alleron text-xs font-bold uppercase tracking-wider text-neutral-300 block">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#ff6305] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="font-alleron w-full py-3.5 rounded-xl bg-[#ff6305] text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-600 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{loading ? "Autenticando..." : "Entrar no CMS"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Dica de Acesso Rápido / Seed Inicial */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-xs text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-300 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-[#ff6305]" />
              <span>Acesso Inicial da Diretoria:</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Usuário: <code className="text-orange-300 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">admin@belezuranews.com.br</code>
            </p>
            <p className="text-[11px] text-neutral-400">
              Senha padrão: <code className="text-orange-300 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">Admin@Belezura2026</code>
            </p>
          </div>
        </div>

        {/* Rodapé do Login */}
        <p className="text-center text-[11px] text-neutral-600 mt-6">
          © {new Date().getFullYear()} Belezura News • Sistema Editorial Seguro
        </p>
      </div>
    </div>
  );
}

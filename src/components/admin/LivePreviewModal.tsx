"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Smartphone,
  Monitor,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ExternalLink,
  Tag as TagIcon,
  CheckCircle2,
} from "lucide-react";
import { AnimatedHeaderLogo } from "@/components/public/AnimatedHeaderLogo";

export interface PostFormData {
  title: string;
  subtitle: string;
  category: string;
  author: string;
  authorId?: string;
  date: string;
  imageWeb: string;
  imageMobile: string;
  imageSourceText: string;
  imageSourceUrl: string;
  content: string;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
}


interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PostFormData;
  onPublish?: () => void;
}

export function LivePreviewModal({
  isOpen,
  onClose,
  data,
  onPublish,
}: LivePreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("desktop");

  // Trava a rolagem da página do fundo (painel) quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Imagem ativa dependendo do modo selecionado
  const activeImage =
    deviceMode === "mobile" && data.imageMobile
      ? data.imageMobile
      : data.imageWeb ||
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Container Principal do Modal */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 15 }}
        className="relative z-10 w-full max-w-6xl h-[92vh] max-h-[95vh] bg-[#FAF9F6] text-neutral-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-700/50"
      >
        {/* Topbar do Simulador (Controles de Dispositivo & Publicação) */}
        <div className="bg-neutral-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Live Preview em Tempo Real
            </span>
          </div>

          {/* Toggle Mobile vs Desktop */}
          <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-neutral-700">
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                deviceMode === "mobile"
                  ? "bg-[#ff6305] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (390px)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                deviceMode === "desktop"
                  ? "bg-[#ff6305] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Ações: Publicar ou Fechar */}
          <div className="flex items-center gap-3">
            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                className="font-alleron hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ff6305] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publicar Agora</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Fechar preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport do Preview com Scroll e Overscroll-contain */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8 flex justify-center items-start bg-neutral-200/50">
          <div
            className={`transition-all duration-300 bg-[#FAF9F6] shadow-xl rounded-2xl overflow-hidden border border-neutral-300/80 my-auto sm:my-0 ${
              deviceMode === "mobile"
                ? "w-[390px] min-h-[780px]"
                : "w-full max-w-4xl min-h-[600px] overflow-y-auto overscroll-contain"
            }`}
          >
            {/* Header Simulado */}
            <div className="p-4 sm:p-6 border-b border-neutral-200/70 text-center bg-white">
              <div className="scale-75 sm:scale-90 transform-gpu inline-block">
                <AnimatedHeaderLogo />
              </div>
            </div>

            {/* Conteúdo da Matéria */}
            <article className="p-5 sm:p-8 space-y-6">
              {/* Badge de Categoria & Metadados */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-alleron px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#ff6305] text-white shadow-sm">
                    {data.category || "Geral"}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" /> 3 min de leitura
                  </span>
                </div>

                {/* Título Principal na Recoleta */}
                <h1 className="font-recoleta text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-950 leading-tight">
                  {data.title || "Título da sua nova matéria no Belezura News"}
                </h1>

                {/* Subtítulo */}
                {data.subtitle && (
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                    {data.subtitle}
                  </p>
                )}

                {/* Linha Fina do Autor e Data */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs">
                      {(data.author || "R").charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800">
                        Por {data.author || "Redação Belezura"}
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        {data.date ? new Date(data.date).toLocaleDateString("pt-BR") : "Hoje"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-400">
                    <button type="button" className="p-1 hover:text-neutral-900">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:text-neutral-900">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Imagem de Capa com Créditos Obrigatórios */}
              <div className="space-y-2">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img
                    src={activeImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-medium">
                    {deviceMode === "mobile" ? "Foto Mobile" : "Foto Web"}
                  </div>
                </div>

                {/* Créditos da Imagem com Hyperlink Obrigatório */}
                {(data.imageSourceText || data.imageSourceUrl) && (
                  <div className="mt-2 text-[11px] sm:text-xs text-neutral-500 flex items-center gap-1.5 px-0.5">
                    <span className="font-semibold text-neutral-400">Fonte:</span>
                    {data.imageSourceUrl ? (
                      <a
                        href={data.imageSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-600 hover:text-[#ff6305] underline underline-offset-2 decoration-neutral-300 hover:decoration-[#ff6305] transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        <span>{data.imageSourceText || "Fonte Original"}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-neutral-600">{data.imageSourceText}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Corpo da Matéria formatado */}
              <div className="prose prose-neutral max-w-none text-neutral-800 text-sm sm:text-base leading-relaxed space-y-4">
                {data.content ? (
                  data.content.includes("<") ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                  ) : (
                    data.content.split("\n\n").map((paragrafo, idx) => (
                      <p key={idx}>{paragrafo}</p>
                    ))
                  )
                ) : (
                  <p className="text-neutral-400 italic">
                    O corpo do seu texto aparecerá aqui conforme você escreve no editor...
                  </p>
                )}
              </div>

              {/* Tags da Matéria */}
              {data.tags && data.tags.length > 0 && (
                <div className="pt-6 border-t border-neutral-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TagIcon className="w-3.5 h-3.5 text-neutral-400" />
                    {data.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

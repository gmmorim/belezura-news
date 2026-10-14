"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check, MessageCircle, Twitter, Facebook } from "lucide-react";

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

export function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn("Falha ao copiar:", err);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Compartilhar:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200/60 text-xs font-semibold transition-all duration-200"
        title="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">WhatsApp</span>
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 hover:bg-neutral-900 hover:text-white border border-neutral-200 text-xs font-semibold transition-all duration-200"
        title="Compartilhar no X (Twitter)"
      >
        <Twitter className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">X</span>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/60 text-xs font-semibold transition-all duration-200"
        title="Compartilhar no Facebook"
      >
        <Facebook className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Facebook</span>
      </a>

      {/* Copiar Link */}
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
          copied
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-white text-neutral-700 hover:border-[#ff6305] hover:text-[#ff6305] border-neutral-200"
        }`}
        title="Copiar link da matéria"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copiado!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copiar Link</span>
          </>
        )}
      </button>
    </div>
  );
}

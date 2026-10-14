"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Link2,
  Check,
  MessageCircle,
  Linkedin,
  Facebook,
} from "lucide-react";

export interface ShareButtonsProps {
  title: string;
  url?: string;
  subtitle?: string;
  className?: string;
}

// Ícones Vetoriais SVG Inline Otimizados para Redes Específicas
function ThreadsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 192 192"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4184 44.7441 97.2749 44.7431 97.1314 44.7431C82.2616 44.7431 69.7731 51.1628 61.9723 62.8553C54.1205 74.6234 51.7225 90.7954 55.2014 108.459C58.5492 125.457 67.3516 139.771 80.0076 148.8C91.6888 157.135 106.31 161.439 122.527 161.439C139.062 161.439 153.228 156.884 163.743 147.935C173.308 139.795 178.694 128.528 179.742 114.475C180.893 99.0396 175.765 85.3421 165.419 75.0592C154.512 64.2188 139.387 58.1793 121.272 57.6534C120.316 57.6258 119.349 57.6119 118.374 57.6119C101.442 57.6119 86.8407 63.6338 76.1264 75.0089C65.3459 86.4529 59.4312 102.164 59.4312 120.612C59.4312 138.868 65.3121 154.492 76.0121 165.922C86.7495 177.391 101.379 183.429 118.374 183.429C130.638 183.429 141.488 179.997 150.706 173.204C153.072 171.46 153.58 168.17 151.836 165.804C150.092 163.438 146.802 162.93 144.436 164.674C136.958 170.186 128.163 172.973 118.374 172.973C104.385 172.973 92.3618 167.971 83.4897 158.497C74.6521 149.06 69.8872 136.002 69.8872 120.612C69.8872 105.029 74.7877 91.8744 83.693 82.4172C92.4839 73.0829 104.536 68.0679 118.374 68.0679C119.176 68.0679 119.972 68.0793 120.761 68.1022C136.19 68.5501 148.971 73.6623 158.079 82.7214C166.726 91.3217 170.978 102.585 170.076 115.191C169.213 127.24 164.819 136.632 157.027 143.264C148.406 150.603 136.757 154.341 122.527 154.341C108.318 154.341 95.7483 150.638 85.9458 143.484C75.2917 135.706 67.9255 123.704 65.1742 109.324C62.2472 94.0249 64.2952 80.0075 70.9997 69.8975C77.4093 60.2312 87.6757 55.1991 99.894 55.1991C100.016 55.1991 100.138 55.1999 100.26 55.2007C121.218 55.3344 133.432 68.4239 134.787 91.0186C129.569 88.5839 123.754 87.2608 117.477 87.2608C94.2758 87.2608 79.7909 101.077 79.7909 121.231C79.7909 132.84 85.5502 142.348 95.3905 146.994C102.732 150.459 111.455 151.277 120.061 149.278C129.28 147.135 137.197 141.226 142.321 132.658C145.412 127.487 147.265 121.036 147.882 113.344C148.169 113.484 148.455 113.627 148.74 113.774C151.785 115.344 153.307 118.995 152.138 122.259C149.337 130.074 144.821 136.945 138.991 142.148C130.137 150.05 119.297 154.075 106.744 154.075C96.1132 154.075 86.9174 150.627 80.3546 143.834C73.7431 137.019 70.1601 127.359 70.1601 115.864C70.1601 101.446 75.3183 89.2843 85.068 80.7024C94.7578 72.1643 107.962 67.5898 123.36 67.5898C139.771 67.5898 153.228 72.8227 162.778 82.8105C172.583 93.0729 177.348 105.807 176.289 119.866C175.291 133.064 170.292 143.585 161.353 151.22C151.528 159.608 138.257 163.856 122.527 163.856C105.345 163.856 89.8785 159.298 77.4925 150.395C64.0673 140.744 54.7438 125.568 51.1966 107.564C47.5029 88.8049 50.0536 71.6575 58.4116 59.1009C66.7584 46.5658 80.1264 39.7042 96.0688 39.7042C96.2223 39.7042 96.3758 39.7053 96.5292 39.7063C123.272 39.878 139.261 56.637 140.852 86.0838C141.082 87.0504 141.31 88.0185 141.537 88.9883ZM118.069 97.472C101.42 97.472 90.0053 106.634 90.0053 121.231C90.0053 133.251 98.7909 140.354 110.84 140.354C117.842 140.354 124.62 137.994 130.045 133.684C135.253 129.544 138.868 123.868 140.407 117.182C136.63 104.993 128.532 97.472 118.069 97.472Z" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function SocialShareButtons({
  title,
  url,
  subtitle,
  className = "",
}: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLocalhostProp =
        url && (url.includes("localhost") || url.includes("127.0.0.1"));
      const isWindowNotLocalhost =
        !window.location.hostname.includes("localhost") &&
        !window.location.hostname.includes("127.0.0.1");

      if (!url || (hasLocalhostProp && isWindowNotLocalhost)) {
        setShareUrl(window.location.href);
      } else {
        setShareUrl(url);
      }

      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        setCanNativeShare(true);
      }
    }
  }, [url]);

  const getDynamicUrl = () => {
    if (typeof window !== "undefined") {
      const hasLocalhostProp =
        url && (url.includes("localhost") || url.includes("127.0.0.1"));
      const isWindowNotLocalhost =
        !window.location.hostname.includes("localhost") &&
        !window.location.hostname.includes("127.0.0.1");

      if (!url || (hasLocalhostProp && isWindowNotLocalhost)) {
        return window.location.href;
      }
      return url;
    }
    return shareUrl || url || "";
  };

  const handleNativeShare = async () => {
    const finalUrl = getDynamicUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: subtitle ? `${title} — ${subtitle}` : title,
          url: finalUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          console.warn("Erro ao acionar compartilhamento nativo:", err);
        }
      }
    }
  };

  const handleCopy = async () => {
    try {
      const finalUrl = getDynamicUrl();
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(finalUrl);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = finalUrl;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Falha ao copiar link:", err);
    }
  };

  const activeUrl =
    shareUrl || (typeof window !== "undefined" ? window.location.href : url || "");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(activeUrl);
  const encodedTextWithUrl = encodeURIComponent(`${title} ${activeUrl}`);

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${className}`}
      role="region"
      aria-label="Compartilhar matéria"
    >
      {/* 1. Botão Nativo (Web Share API - iOS / Android: Instagram Stories, SMS, Apps) */}
      {canNativeShare && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-[#ff6305]/10 text-[#ff6305] hover:bg-[#ff6305] hover:text-white border border-[#ff6305]/30 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          title="Partilhar no seu aparelho (Instagram Stories, SMS, Apps)"
          aria-label="Partilhar usando aplicativos do sistema"
        >
          <Share2 className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      )}

      {/* 2. WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTextWithUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200/70 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no WhatsApp"
        aria-label="Compartilhar no WhatsApp"
      >
        <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      </a>

      {/* 3. Threads */}
      <a
        href={`https://threads.net/intent/post?text=${encodedTextWithUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-neutral-100 text-neutral-800 hover:bg-black hover:text-white border border-neutral-200 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no Threads"
        aria-label="Compartilhar no Threads"
      >
        <ThreadsIcon className="w-4 h-4 shrink-0" />
      </a>

      {/* 4. Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-neutral-100 text-neutral-800 hover:bg-neutral-900 hover:text-white border border-neutral-200 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no X (Twitter)"
        aria-label="Compartilhar no X (Twitter)"
      >
        <XIcon className="w-4 h-4 shrink-0" />
      </a>

      {/* 5. LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-50 text-sky-700 hover:bg-[#0077b5] hover:text-white border border-sky-200/70 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no LinkedIn"
        aria-label="Compartilhar no LinkedIn"
      >
        <Linkedin className="w-4 h-4 shrink-0" aria-hidden="true" />
      </a>

      {/* 6. Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-sky-50 text-sky-600 hover:bg-[#229ED9] hover:text-white border border-sky-200/70 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no Telegram"
        aria-label="Compartilhar no Telegram"
      >
        <TelegramIcon className="w-4 h-4 shrink-0" />
      </a>

      {/* 7. Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-700 hover:bg-[#1877f2] hover:text-white border border-blue-200/70 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
        title="Compartilhar no Facebook"
        aria-label="Compartilhar no Facebook"
      >
        <Facebook className="w-4 h-4 shrink-0" aria-hidden="true" />
      </a>

      {/* 8. Copiar Link */}
      <button
        type="button"
        onClick={handleCopy}
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${
          copied
            ? "bg-emerald-500 text-white border-emerald-500"
            : "bg-white text-neutral-700 hover:border-[#ff6305] hover:text-[#ff6305] border-neutral-200"
        }`}
        title={copied ? "Link copiado com sucesso!" : "Copiar link da matéria"}
        aria-label={copied ? "Link copiado" : "Copiar link"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-white" aria-hidden="true" />
        ) : (
          <Link2 className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

// Aliases para conveniência e compatibilidade
export const ShareButtons = SocialShareButtons;
export default SocialShareButtons;

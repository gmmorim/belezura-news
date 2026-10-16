"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Trash2, CheckCircle2 } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface ControlledImageUploadProps {
  name: "imageWeb" | "imageMobile";
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  aspectRatio?: "video" | "mobile";
  onUploadSuccess?: (url: string) => void;
}

export function ControlledImageUpload({
  name,
  label,
  required = false,
  icon,
  aspectRatio = "video",
  onUploadSuccess,
}: ControlledImageUploadProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchedUrl = watch(name);
  const fieldError = errors[name]?.message as string | undefined;

  const handleUploadComplete = (res: any) => {
    // Extrai a URL da resposta do UploadThing com suporte a .url e .ufsUrl
    const fileUrl =
      res?.[0]?.url || (res?.[0] as any)?.ufsUrl || (res?.[0] as any)?.appUrl || "";

    if (fileUrl) {
      // Injeta no React Hook Form forçando validação e marcando dirty
      setValue(name, fileUrl, { shouldValidate: true, shouldDirty: true });

      if (onUploadSuccess) {
        onUploadSuccess(fileUrl);
      }
    }
  };

  const handleRemove = () => {
    // Limpa a URL permitindo que o Dropzone volte a aparecer
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
      {/* Cabeçalho do Card com Título e Badge de Sucesso */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <label className="block text-xs font-bold uppercase tracking-wider text-white">
            {label} {required && <span className="text-[#ff6305]">*</span>}
          </label>
        </div>

        {watchedUrl && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Imagem Carregada com Sucesso
          </span>
        )}
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL EXATA: Preview vs Dropzone */}
      {watchedUrl ? (
        /* Se HOUVER URL: Renderiza preview visual e botão de remover/trocar */
        <div className="space-y-3 animate-fade-in">
          <div
            className={`relative w-full rounded-xl overflow-hidden border border-emerald-500/30 bg-neutral-950 group shadow-lg ${
              aspectRatio === "video" ? "aspect-video" : "aspect-[4/3]"
            }`}
          >
            <img
              src={watchedUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Botão flutuante "Remover / Trocar Imagem" sobre o preview */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remover / Trocar Imagem</span>
              </button>
              <p className="text-[11px] text-neutral-300">
                Clique para apagar esta foto e reabrir a área de upload
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <span className="truncate max-w-[260px]" title={watchedUrl}>
              {watchedUrl}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 font-medium ml-2 shrink-0 transition-colors"
            >
              Remover / Trocar
            </button>
          </div>
        </div>
      ) : (
        /* Se NÃO houver URL: Renderiza o UploadDropzone (sem input de texto manual) */
        <div className="space-y-2 animate-fade-in">
          <UploadDropzone
            endpoint="postImageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={(error: Error) => {
              console.error("[UPLOADTHING_ERROR]", error);
              alert(`Erro no upload da imagem: ${error.message}`);
            }}
            className="border-neutral-800 bg-neutral-950/60 ut-label:text-[#ff6305] ut-button:bg-[#ff6305] ut-button:text-white rounded-xl py-6"
          />
          {fieldError && (
            <p className="text-xs text-red-400 font-medium px-1">
              {fieldError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

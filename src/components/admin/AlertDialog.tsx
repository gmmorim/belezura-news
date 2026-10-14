"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemBadge?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemBadge,
  confirmLabel = "Sim, excluir",
  cancelLabel = "Cancelar",
  isLoading = false,
}: AlertDialogProps) {
  // Trava scroll do body
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop escurecido com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!isLoading) onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-neutral-100"
          >
            {/* Botão Fechar no canto superior */}
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              aria-label="Fechar diálogo"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              {/* Ícone de Perigo / Alerta */}
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              {/* Título e Descrição */}
              <div className="space-y-1.5">
                <h3 className="font-recoleta text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Destaque do Item a ser excluído */}
              {itemBadge && (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono break-words line-clamp-2">
                  <span className="text-neutral-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Item selecionado:
                  </span>
                  {itemBadge}
                </div>
              )}

              {/* Ações: Cancelar vs Confirmar */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onClose}
                  className="font-alleron px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onConfirm}
                  className="font-alleron inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Excluindo...</span>
                    </>
                  ) : (
                    <span>{confirmLabel}</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

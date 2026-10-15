"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Escreva o texto completo da matéria...",
}: TiptapEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-xl w-full my-6 border border-neutral-800 object-cover shadow-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#ff6305] underline font-medium",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[320px] p-4 sm:p-5 focus:outline-none text-neutral-100 text-sm sm:text-base leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Atualiza o conteúdo quando o formulário hidrata dados (ex: edição de post)
  // Somente atualiza se o editor NÃO estiver focado pelo usuário, evitando reset de cursor/formatação
  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse" />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do Link:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleInsertImage = () => {
    if (imageUrl.trim()) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl.trim(), alt: imageAlt.trim() || undefined })
        .run();
      setImageUrl("");
      setImageAlt("");
      setImageModalOpen(false);
    }
  };

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#ff6305] transition-all">
      {/* Barra de Ferramentas Editorial (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-950/80 border-b border-neutral-800">
        {/* H1 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Título Principal H1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        {/* H2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Título H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Subtítulo H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        {/* H4 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("heading", { level: 4 })
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Intertítulo H4"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* Negrito */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("bold")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Itálico */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("italic")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Tachado */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("strike")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Tachado"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* Lista com Marcadores */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("bulletList")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Lista com marcadores"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Lista Numerada */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("orderedList")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Citação / Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("blockquote")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Citação / Bloco de Destaque"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-800 mx-1" />

        {/* Inserir Imagem no Meio do Texto */}
        <button
          type="button"
          onClick={() => setImageModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            imageModalOpen
              ? "bg-[#ff6305] text-white"
              : "text-neutral-300 bg-neutral-900 border border-neutral-700 hover:text-white hover:bg-neutral-800"
          }`}
          title="Inserir Imagem no Meio do Texto"
        >
          <ImageIcon className="w-4 h-4 text-[#ff6305]" />
          <span>Inserir Imagem</span>
        </button>

        {/* Inserir Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-xs font-bold transition-colors ${
            editor.isActive("link")
              ? "bg-[#ff6305] text-white"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
          title="Inserir / Editar Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded-lg text-xs text-red-400 hover:bg-neutral-800 transition-colors"
            title="Remover Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}

        <div className="h-4 w-px bg-neutral-800 mx-1 ml-auto" />

        {/* Desfazer / Refazer */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition-colors"
          title="Desfazer"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition-colors"
          title="Refazer"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Modal / Caixa para Inserir Imagem */}
      {imageModalOpen && (
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#ff6305]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Inserir Imagem no Artigo
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setImageModalOpen(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Opção A: Upload direto via UploadThing */}
            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2 text-center">
              <p className="text-xs text-neutral-300 font-semibold">
                Fazer upload do seu computador
              </p>
              <div className="flex justify-center pt-1">
                <UploadButton
                  endpoint="postImageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                      editor
                        .chain()
                        .focus()
                        .setImage({
                          src: res[0].url,
                          alt: res[0].name || "Imagem do artigo",
                        })
                        .run();
                      setImageModalOpen(false);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Erro ao fazer upload da imagem: ${error.message}`);
                  }}
                  appearance={{
                    button:
                      "bg-[#ff6305] hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors",
                    allowedContent: "text-[10px] text-neutral-500",
                  }}
                />
              </div>
            </div>

            {/* Opção B: Inserir via URL direta */}
            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
              <p className="text-xs text-neutral-300 font-semibold">
                Ou cole a URL direta de uma imagem
              </p>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff6305]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Legenda / Alt da imagem (opcional)"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#ff6305]"
                  />
                  <button
                    type="button"
                    onClick={handleInsertImage}
                    disabled={!imageUrl.trim()}
                    className="px-3 py-1.5 bg-[#ff6305] hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Inserir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área de Edição (TipTap Content) */}
      <EditorContent editor={editor} />
    </div>
  );
}

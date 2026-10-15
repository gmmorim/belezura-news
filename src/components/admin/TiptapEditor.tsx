"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
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
          "prose prose-invert max-w-none min-h-[280px] p-4 sm:p-5 focus:outline-none text-neutral-100 text-sm sm:text-base leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Atualiza o conteúdo quando o formulário hidrata dados (ex: edição de post)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
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

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#ff6305] transition-all">
      {/* Barra de Ferramentas Editorial (Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-950/80 border-b border-neutral-800">
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

      {/* Área de Edição (TipTap Content) */}
      <EditorContent editor={editor} />
    </div>
  );
}

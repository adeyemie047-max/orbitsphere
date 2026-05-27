"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import EditorToolbar from "./EditorToolbar";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string | null>;
  placeholder?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = "Start writing your story…",
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline" },
      }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full my-4" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[280px] px-6 py-5 outline-none font-[family-name:var(--font-sans)] text-[15px] text-text-secondary leading-[1.75] focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-gold [&_img]:rounded-lg [&_img]:max-w-full",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div>
      <EditorToolbar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
}

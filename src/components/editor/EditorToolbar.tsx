"use client";

import type { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string | null>;
}

type ToolItem =
  | { id: string; sep: true }
  | {
      id: string;
      label: string;
      title: string;
      action: () => void;
      isActive?: () => boolean;
      italic?: boolean;
      underline?: boolean;
    };

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !onImageUpload) return;

    const url = await onImageUpload(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const items: ToolItem[] = [
    {
      id: "bold",
      label: "B",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      id: "italic",
      label: "I",
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      italic: true,
    },
    {
      id: "underline",
      label: "U",
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      underline: true,
    },
    { id: "sep1", sep: true },
    {
      id: "h1",
      label: "H1",
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      id: "h2",
      label: "H2",
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      id: "h3",
      label: "H3",
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    { id: "sep2", sep: true },
    {
      id: "bullet",
      label: "≡",
      title: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      id: "ordered",
      label: "1.",
      title: "Numbered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      id: "quote",
      label: "\u201C",
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    { id: "sep3", sep: true },
    {
      id: "link",
      label: "🔗",
      title: "Link",
      action: setLink,
      isActive: () => editor.isActive("link"),
    },
    {
      id: "image",
      label: "🖼",
      title: "Image",
      action: handleImagePick,
    },
  ];

  return (
    <div className="bg-white/[0.03] border-b border-white/6 px-4 py-2.5 flex gap-1 flex-wrap items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageFile}
      />
      {items.map((item) =>
        "sep" in item && item.sep ? (
          <div key={item.id} className="w-px h-6 bg-white/6 mx-1 self-center" />
        ) : (
          (() => {
            const tool = item as Extract<ToolItem, { label: string }>;
            const active = tool.isActive?.() ?? false;
            return (
              <button
                key={tool.id}
                type="button"
                title={tool.title}
                onClick={tool.action}
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center font-[family-name:var(--font-ui)] text-xs font-bold cursor-pointer transition-all border",
                  active
                    ? "bg-[rgba(212,175,55,0.12)] text-gold border-[rgba(212,175,55,0.2)]"
                    : "bg-transparent text-text-secondary border-transparent hover:bg-white/8 hover:text-white hover:border-white/6",
                  tool.italic && "italic",
                  tool.underline && "underline"
                )}
              >
                {tool.label}
              </button>
            );
          })()
        )
      )}
    </div>
  );
}

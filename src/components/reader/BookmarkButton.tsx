"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  articleId: string;
  className?: string;
}

export default function BookmarkButton({ articleId, className }: BookmarkButtonProps) {
  const { status } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/v1/bookmarks")
      .then((r) => r.json())
      .then((json) => {
        const ids = (json.data ?? []).map(
          (b: { article: { id: string } }) => b.article.id
        );
        setSaved(ids.includes(articleId));
      })
      .catch(() => {});
  }, [status, articleId]);

  if (status !== "authenticated") return null;

  const toggle = async () => {
    setLoading(true);
    try {
      if (saved) {
        await fetch(`/api/v1/bookmarks/${articleId}`, { method: "DELETE" });
        setSaved(false);
      } else {
        const res = await fetch("/api/v1/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        });
        if (res.ok) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      className={cn(
        "font-[family-name:var(--font-ui)] text-xs font-semibold px-3 py-1.5 rounded-md border transition-all cursor-pointer",
        saved
          ? "chip-selected"
          : "chip hover:text-[var(--ds-accent)]",
        className
      )}
      aria-label={saved ? "Remove bookmark" : "Save article"}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}

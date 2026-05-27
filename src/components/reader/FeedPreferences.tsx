"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Category = { id: string; name: string; slug: string; color: string | null };

export default function FeedPreferences({
  initial,
  categories,
}: {
  initial: Category[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initial.map((c) => c.id))
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    setStatus("saving");
    await fetch("/api/v1/feed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: [...selected] }),
    });
    setStatus("saved");
  };

  if (categories.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-[14px] p-6">
      <h2 className="font-serif text-lg font-bold text-foreground mb-2">
        Feed preferences
      </h2>
      <p className="font-ui text-xs text-text-muted mb-4">
        Choose categories to personalize your feed
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggle(cat.id)}
            className={`font-ui text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
              selected.has(cat.id)
                ? "chip-selected"
                : "chip"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <Button size="sm" onClick={() => void save()} disabled={status === "saving"}>
        {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save preferences"}
      </Button>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize-html";

type LiveEntry = {
  id: string;
  body: string;
  isPinned: boolean;
  publishedAt: string;
  author: { name: string; avatarUrl: string | null };
};

interface LiveBlogLayoutProps {
  slug: string;
  title: string;
}

export default function LiveBlogLayout({ slug, title }: LiveBlogLayoutProps) {
  const [entries, setEntries] = useState<LiveEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    const res = await fetch(`/api/v1/articles/${slug}/live`);
    if (res.ok) {
      const json = await res.json();
      setEntries(json.data?.entries ?? []);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    void fetchEntries();
    const interval = setInterval(fetchEntries, 30_000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center gap-1.5 font-ui text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[rgba(34,197,94,0.15)] text-live border border-[rgba(34,197,94,0.3)] animate-[glow_2s_infinite]">
          <span className="w-2 h-2 rounded-full bg-live" />
          Live
        </span>
        <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">{title}</h2>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm font-ui">Loading updates…</p>
      ) : entries.length === 0 ? (
        <p className="text-text-muted text-sm font-ui">
          Live updates will appear here as the story develops.
        </p>
      ) : (
        <ol className="relative border-l border-border ml-3 space-y-6 sm:space-y-8">
          {entries.map((entry, i) => (
            <li key={entry.id} className="ml-6 relative">
              <span
                className={cn(
                  "absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-background",
                  entry.isPinned ? "bg-[var(--ds-accent)]" : i === 0 ? "bg-live" : "bg-border"
                )}
              />
              <time className="font-ui text-[11px] text-gold block mb-1">
                {formatRelativeTime(entry.publishedAt)}
                {entry.isPinned && " · Pinned"}
              </time>
              <p className="font-ui text-[11px] text-text-muted mb-2">
                {entry.author.name}
              </p>
              <div
                className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(entry.body) }}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

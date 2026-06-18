"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type ReviewArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  submittedForReview: boolean;
  updatedAt: string;
  author: { id: string; name: string; email: string };
  category: { name: string };
};

export default function ReviewQueuePanel() {
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/v1/admin/articles/review?limit=30");
    if (res.ok) {
      const json = await res.json();
      setArticles(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchQueue();
  }, [fetchQueue]);

  const review = async (id: string, action: "publish" | "return") => {
    setActingId(id);
    const res = await fetch(`/api/v1/admin/articles/${id}/review`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } else {
      const json = await res.json();
      alert(json.error ?? "Action failed");
    }
    setActingId(null);
  };

  return (
    <div>
      {loading ? (
        <p className="text-text-muted text-sm">Loading review queue…</p>
      ) : articles.length === 0 ? (
        <div className="p-8 bg-surface border border-white/6 rounded-[14px] text-center">
          <p className="text-text-secondary text-sm">
            No articles awaiting editorial review.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li
              key={article.id}
              className="p-5 bg-surface border border-white/6 rounded-[14px]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-lg font-bold text-white">
                    {article.title}
                  </h2>
                  <p className="font-[family-name:var(--font-ui)] text-xs text-text-muted mt-1">
                    {article.author.name} · {article.category.name} · Updated{" "}
                    {new Date(article.updatedAt).toLocaleString("en-NG")}
                  </p>
                </div>
              </div>
              {article.excerpt && (
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/6">
                <Button size="sm" variant="outline" href={`/dashboard/write?id=${article.id}`}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  disabled={actingId === article.id}
                  onClick={() => void review(article.id, "publish")}
                >
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actingId === article.id}
                  onClick={() => void review(article.id, "return")}
                >
                  Return to author
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-xs text-text-muted">
        Journalists submit drafts from the editor via &ldquo;Submit for Review&rdquo;. Editors
        publish or return them here.
      </p>
    </div>
  );
}

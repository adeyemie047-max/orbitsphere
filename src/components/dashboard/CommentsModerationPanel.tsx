"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type PendingComment = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string; email: string };
  article: { id: string; title: string; slug: string };
};

export default function CommentsModerationPanel() {
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/v1/admin/comments/pending?limit=30");
    if (res.ok) {
      const json = await res.json();
      setComments(json.data ?? []);
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to load pending comments");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  const approve = async (id: string) => {
    setActingId(id);
    setError(null);
    const res = await fetch(`/api/v1/comments/${id}/approve`, { method: "PUT" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to approve comment");
    }
    setActingId(null);
  };

  const reject = async (id: string) => {
    if (!confirm("Delete this comment permanently?")) return;
    setActingId(id);
    setError(null);
    const res = await fetch(`/api/v1/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to reject comment");
    }
    setActingId(null);
  };

  return (
    <div>
      {error && (
        <p className="mb-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-text-muted text-sm">Loading pending comments…</p>
      ) : comments.length === 0 ? (
        <div className="p-8 bg-surface border border-white/6 rounded-[14px] text-center">
          <p className="text-text-secondary text-sm">No comments awaiting moderation.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="p-5 bg-surface border border-white/6 rounded-[14px]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-[family-name:var(--font-ui)] text-xs text-text-muted">
                    {comment.author.name} · {comment.author.email} ·{" "}
                    {new Date(comment.createdAt).toLocaleString("en-NG")}
                  </p>
                  <Link
                    href={`/article/${comment.article.slug}`}
                    className="font-[family-name:var(--font-serif)] text-sm font-bold text-gold hover:underline mt-1 inline-block"
                    target="_blank"
                  >
                    {comment.article.title}
                  </Link>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {comment.body}
              </p>
              <div className="flex gap-2 pt-2 border-t border-white/6">
                <Button
                  size="sm"
                  disabled={actingId === comment.id}
                  onClick={() => void approve(comment.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={actingId === comment.id}
                  onClick={() => void reject(comment.id)}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

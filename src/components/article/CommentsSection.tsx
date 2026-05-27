"use client";

import { useState } from "react";
import Link from "next/link";
import type { SerializedComment } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

interface CommentsSectionProps {
  articleSlug: string;
  initialComments: SerializedComment[];
}

function CommentItem({ comment, depth = 0 }: { comment: SerializedComment; depth?: number }) {
  return (
    <div className={depth > 0 ? "ml-8 sm:ml-10 mt-4 border-l border-border pl-4" : ""}>
      <div className="grid grid-cols-[40px_1fr] gap-3.5 py-5 border-b border-border">
        <Avatar initials={comment.author.initials} />
        <div>
          <span className="font-ui text-[13px] font-semibold text-text-primary">
            {comment.author.name}
          </span>
          <span className="font-ui text-xs text-text-muted">
            {" "}
            · {formatRelativeTime(comment.createdAt)}
          </span>
          <p className="text-sm text-text-secondary leading-[1.65] mt-2">
            {comment.body}
          </p>
        </div>
      </div>
      {comment.replies.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentsSection({
  articleSlug,
  initialComments,
}: CommentsSectionProps) {
  const [comments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/articles/${articleSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      const data = await response.json();

      if (response.status === 401) {
        setMessage("Sign in to join the conversation.");
        return;
      }

      if (!response.ok) {
        setMessage(data.error ?? "Could not post comment.");
        return;
      }

      setBody("");
      setMessage(
        data.message ??
          "Comment submitted and awaiting moderation before it appears publicly."
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-12 panel p-5 sm:p-6" id="comments">
      <h3 className="font-serif text-[22px] font-bold text-foreground mb-6">
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm text-text-muted mb-6">
          No comments yet. Be the first to share your perspective.
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}

      <form className="mt-6" onSubmit={handleSubmit}>
        {message && (
          <p className="text-sm text-text-secondary mb-3 panel px-4 py-3">
            {message}{" "}
            {message.includes("Sign in") && (
              <Link href="/sign-in" className="text-[var(--ds-accent)] hover:underline">
                Sign in
              </Link>
            )}
          </p>
        )}
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="field-textarea"
          placeholder="Share your thoughts on this story…"
          required
          minLength={3}
        />
        <div className="flex justify-end mt-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Posting…" : "Post Comment"}
          </Button>
        </div>
        <p className="font-ui text-[11px] text-text-muted mt-2 text-right">
          Comments are moderated per OrbitSphere editorial policy.
        </p>
      </form>
    </section>
  );
}

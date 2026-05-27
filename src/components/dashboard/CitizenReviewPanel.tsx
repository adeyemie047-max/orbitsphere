"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Submission = {
  id: string;
  submitterName: string;
  email: string;
  title: string;
  body: string;
  mediaUrl: string | null;
  status: string;
  submittedAt: string;
};

const STATUS_FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
] as const;

export default function CitizenReviewPanel() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "20" });
    if (status) params.set("status", status);
    const res = await fetch(`/api/v1/admin/citizen/submissions?${params}`);
    if (res.ok) {
      const json = await res.json();
      setSubmissions(json.data ?? []);
    }
    setLoading(false);
  }, [status]);

  useEffect(() => {
    void fetchSubmissions();
  }, [fetchSubmissions]);

  const review = async (id: string, nextStatus: "reviewed" | "approved" | "rejected") => {
    setUpdatingId(id);
    const res = await fetch(`/api/v1/admin/citizen/submissions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      await fetchSubmissions();
    }
    setUpdatingId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value || "all"}
            type="button"
            onClick={() => setStatus(filter.value)}
            className={cn(
              "font-[family-name:var(--font-ui)] text-xs px-3 py-1.5 rounded-full border transition-colors",
              status === filter.value
                ? "bg-gold/10 border-gold text-gold"
                : "border-white/10 text-text-muted hover:text-white"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-muted text-sm">Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <div className="p-8 bg-surface border border-white/6 rounded-[14px] text-center">
          <p className="text-text-secondary text-sm">No submissions in this queue.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {submissions.map((item) => (
            <li
              key={item.id}
              className="p-5 bg-surface border border-white/6 rounded-[14px]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-[family-name:var(--font-serif)] text-lg font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="font-[family-name:var(--font-ui)] text-xs text-text-muted mt-1">
                    {item.submitterName} · {item.email} ·{" "}
                    {new Date(item.submittedAt).toLocaleDateString("en-NG")}
                  </p>
                </div>
                <span className="font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-text-secondary">
                  {item.status}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap mb-4">
                {item.body}
              </p>
              {item.mediaUrl && (
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-xs hover:underline mb-4 inline-block"
                >
                  View attached media
                </a>
              )}
              {item.status === "pending" && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/6">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={updatingId === item.id}
                    onClick={() => review(item.id, "reviewed")}
                  >
                    Mark reviewed
                  </Button>
                  <Button
                    size="sm"
                    disabled={updatingId === item.id}
                    onClick={() => review(item.id, "approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={updatingId === item.id}
                    onClick={() => review(item.id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

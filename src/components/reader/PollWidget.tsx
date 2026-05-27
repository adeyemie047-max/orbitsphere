"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type PollData = {
  id: string;
  question: string | null;
  totalVotes: number;
  userVote: string | null;
  options: { id: string; text: string | null; votes: number; percentage: number }[];
};

function getVoterKey() {
  const key = "orbitsphere-voter";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface PollWidgetProps {
  articleSlug: string;
}

export default function PollWidget({ articleSlug }: PollWidgetProps) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const voterKey = getVoterKey();
    const res = await fetch(`/api/v1/articles/${articleSlug}/poll`, {
      headers: { "x-voter-key": voterKey },
    });
    const json = await res.json();
    setPoll(json.data ?? null);
    setLoading(false);
  }, [articleSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const vote = async (optionId: string) => {
    if (!poll || poll.userVote) return;
    const voterKey = getVoterKey();
    const res = await fetch(`/api/v1/polls/${poll.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId, voterKey }),
    });
    const json = await res.json();
    if (json.data) setPoll(json.data);
  };

  if (loading) return null;
  if (!poll) return null;

  const voted = !!poll.userVote;

  return (
    <div className="bg-surface border border-border rounded-[14px] p-6 mb-6">
      <h3 className="font-serif text-lg font-bold text-foreground mb-5 pb-3 border-b border-border">
        Quick Poll
      </h3>
      <p className="text-sm text-text-secondary leading-[1.6] mb-4">
        {poll.question}
      </p>
      <div className="flex flex-col gap-2.5 mb-4">
        {poll.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={voted && poll.userVote !== opt.id}
            onClick={() => void vote(opt.id)}
            className={cn(
              "rounded-lg px-4 py-3 font-ui text-[13px] text-left cursor-pointer transition-all border relative overflow-hidden",
              poll.userVote === opt.id
                ? "chip-selected"
                : voted
                  ? "chip text-text-muted cursor-default"
                  : "chip cursor-pointer hover:border-[var(--ds-accent-border)]"
            )}
          >
            {voted && (
              <span
                className="absolute inset-y-0 left-0 bg-[var(--ds-accent-muted)]"
                style={{ width: `${opt.percentage}%` }}
              />
            )}
            <span className="relative flex justify-between gap-2">
              <span>{opt.text}</span>
              {voted && (
                <span className="text-[var(--ds-accent)] font-semibold">{opt.percentage}%</span>
              )}
            </span>
          </button>
        ))}
      </div>
      <p className="font-ui text-[11px] text-text-muted">
        {poll.totalVotes.toLocaleString()} votes
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BreakingHeadlineItem } from "@/lib/articles-db";

interface BreakingTickerClientProps {
  initialHeadlines: BreakingHeadlineItem[];
}

export default function BreakingTickerClient({
  initialHeadlines,
}: BreakingTickerClientProps) {
  const [headlines, setHeadlines] =
    useState<BreakingHeadlineItem[]>(initialHeadlines);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const source = new EventSource("/api/v1/breaking/stream");

    source.onopen = () => setConnected(true);
    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as BreakingHeadlineItem[];
        if (Array.isArray(data) && data.length > 0) {
          setHeadlines(data);
        }
      } catch {
        /* ignore */
      }
    };
    source.onerror = () => {
      setConnected(false);
      source.close();
    };

    return () => source.close();
  }, []);

  const items = headlines.length > 0 ? [...headlines, ...headlines] : [];

  if (items.length === 0) return null;

  return (
    <div
      className="bg-[var(--ds-accent)] overflow-hidden min-h-9 h-auto sm:h-9 flex items-stretch sm:items-center border-b border-[#c92524]"
      aria-live="polite"
      aria-label="Breaking news ticker"
    >
      <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 font-ui text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.16em] uppercase text-white min-h-9 border-r border-white/20">
        <div
          className={`w-1.5 h-1.5 rounded-full bg-white ${connected ? "animate-[pulse-dot_1.2s_infinite]" : "opacity-60"}`}
        />
        Breaking
      </div>
      <div className="overflow-hidden flex-1 bg-surface">
        <div className="ticker-inner flex whitespace-nowrap">
          {items.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={`/article/${item.slug}`}
              className="font-ui text-[11px] sm:text-xs font-medium text-text-primary px-4 sm:px-8 flex items-center hover:text-[var(--ds-accent)] transition-colors after:content-['|'] after:ml-4 sm:after:ml-8 after:text-border after:font-light"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ReadAloudProps {
  title: string;
  excerpt: string | null;
  body: string | null;
  readTime: number | null;
}

function toPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function ReadAloud({
  title,
  excerpt,
  body,
  readTime,
}: ReadAloudProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const fullText = [title, excerpt, body ? toPlainText(body) : ""]
    .filter(Boolean)
    .join(". ");

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
    setProgress(0);
    utteranceRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (playing) {
      stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-NG";

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      setPlaying(false);
      setProgress(100);
    };
    utterance.onerror = () => stop();
    utterance.onboundary = () => {
      setProgress((p) => Math.min(p + 2, 95));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [fullText, playing, stop]);

  useEffect(() => () => stop(), [stop]);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <div className="bg-surface border border-border rounded-lg sm:rounded-[14px] p-4 flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <button
        type="button"
        onClick={toggle}
        disabled={!supported}
        className="w-11 h-11 rounded-full bg-[var(--ds-accent)] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[var(--ds-accent-hover)] transition-all disabled:opacity-40"
        aria-label={playing ? "Stop narration" : "Listen to this article"}
      >
        {playing ? (
          <span className="block w-3 h-3 bg-white rounded-sm" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white ml-0.5">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <div className="font-ui text-xs font-semibold text-text-primary mb-2">
          {supported
            ? "🎙 Listen to this article — Web Speech narration"
            : "Audio narration unavailable in this browser"}
        </div>
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--ds-accent)] rounded-full transition-all duration-300"
            style={{ width: `${playing ? progress : 0}%` }}
          />
        </div>
        <div className="font-ui text-[11px] text-text-muted mt-1.5">
          {playing ? "Playing…" : `Est. ${readTime ?? 5} min read`}
        </div>
      </div>
    </div>
  );
}

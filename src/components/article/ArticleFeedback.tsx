"use client";

import { useState } from "react";

export default function ArticleFeedback() {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  if (feedback) {
    return (
      <div className="my-10 p-6 bg-surface border border-white/6 rounded-[14px] text-center">
        <p className="font-ui text-sm text-text-secondary">
          Thank you for your feedback!
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 p-6 bg-surface border border-white/6 rounded-[14px] text-center">
      <p className="font-serif text-lg font-bold text-white mb-4">
        Was this article helpful?
      </p>
      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => setFeedback("yes")}
          className="font-ui text-sm font-semibold px-6 py-2.5 rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] text-live hover:bg-[rgba(34,197,94,0.2)] transition-all"
        >
          👍 Yes
        </button>
        <button
          type="button"
          onClick={() => setFeedback("no")}
          className="font-ui text-sm font-semibold px-6 py-2.5 rounded-full bg-white/5 border border-white/6 text-text-secondary hover:border-white/20 transition-all"
        >
          👎 Not really
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Subscribes to breaking-news SSE and refreshes server-rendered ticker markup. */
export default function BreakingTickerStream() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource("/api/v1/breaking/stream");

    source.onmessage = () => {
      router.refresh();
    };

    source.onerror = () => {
      source.close();
    };

    return () => source.close();
  }, [router]);

  return null;
}

"use client";

import { useEffect } from "react";

interface ViewCounterProps {
  slug: string;
}

/** Records a page view via API (does not block ISR page render). */
export default function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    fetch(`/api/v1/articles/${slug}/view`, { method: "POST" }).catch(() => {
      /* non-critical */
    });
  }, [slug]);

  return null;
}

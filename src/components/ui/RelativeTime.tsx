"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/utils";

/** SSR-safe: stable date first, then relative time after mount. */
export default function RelativeTime({
  dateStr,
  className,
}: {
  dateStr: string | null | undefined;
  className?: string;
}) {
  const stable =
    dateStr &&
    new Date(dateStr).toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const [label, setLabel] = useState(stable || "Recently");

  useEffect(() => {
    setLabel(formatRelativeTime(dateStr));
  }, [dateStr]);

  return <span className={className}>{label}</span>;
}

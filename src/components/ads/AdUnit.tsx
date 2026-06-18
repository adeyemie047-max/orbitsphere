"use client";

import { useCallback, useEffect, useRef } from "react";
import EditorialImage from "@/components/ui/EditorialImage";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Advertisement } from "@prisma/client";

type AdPlacement = "banner" | "rectangle";

const SIZES: Record<
  AdPlacement,
  { width: number; height: number; label: string; className: string }
> = {
  banner: {
    width: 728,
    height: 90,
    label: "728 × 90 Leaderboard",
    className: "w-full max-w-[728px] h-[90px]",
  },
  rectangle: {
    width: 300,
    height: 250,
    label: "300 × 250 Rectangle",
    className: "w-[300px] h-[250px]",
  },
};

interface AdUnitProps {
  ad: Advertisement | null;
  placement: AdPlacement;
  className?: string;
}

function trackAdEvent(adId: string, event: "impression" | "click") {
  const payload = JSON.stringify({ event });
  const url = `/api/v1/ads/${adId}/track`;

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

/** PRD §8.1 — clearly labeled advertisement slot with impression/click tracking. */
export default function AdUnit({ ad, placement, className }: AdUnitProps) {
  const { data: session } = useSession();
  const size = SIZES[placement];
  const containerRef = useRef<HTMLElement>(null);
  const impressionSent = useRef(false);

  useEffect(() => {
    if (!ad?.id || impressionSent.current) return;

    const node = containerRef.current;
    if (!node) return;

    const sessionKey = `ad-impression-${ad.id}`;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(sessionKey)) {
      impressionSent.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5);
        if (!visible || impressionSent.current) return;

        impressionSent.current = true;
        sessionStorage.setItem(sessionKey, "1");
        trackAdEvent(ad.id, "impression");
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ad?.id]);

  const handleClick = useCallback(() => {
    if (ad?.id) trackAdEvent(ad.id, "click");
  }, [ad?.id]);

  if (session?.user?.isPremium) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      className={`flex flex-col items-center gap-2 ${className ?? ""}`}
      aria-label="Advertisement"
    >
      <span className="font-ui text-[10px] font-semibold tracking-[0.14em] uppercase text-text-muted">
        Advertisement
      </span>
      {ad?.imageUrl ? (
        <Link
          href={ad.targetUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className={`relative block overflow-hidden rounded-lg border border-white/6 bg-surface ${size.className}`}
        >
          <EditorialImage
            src={ad.imageUrl}
            alt={ad.title ?? "Advertisement"}
            fill
            className="object-cover"
            sizes={placement === "banner" ? "728px" : "300px"}
          />
        </Link>
      ) : (
        <div
          className={`flex items-center justify-center rounded-lg border border-dashed border-[var(--ds-border)] bg-[var(--ds-surface-2)] ${size.className}`}
        >
          <span className="font-ui text-[11px] text-[var(--ds-text-muted)] text-center px-4">
            {size.label}
          </span>
        </div>
      )}
    </aside>
  );
}

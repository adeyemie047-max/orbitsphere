import Image from "next/image";
import Link from "next/link";
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

/** PRD §8.1 — clearly labeled advertisement slot (IAB sizes). */
export default function AdUnit({ ad, placement, className }: AdUnitProps) {
  const size = SIZES[placement];

  return (
    <aside
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
          className={`relative block overflow-hidden rounded-lg border border-white/6 bg-surface ${size.className}`}
        >
          <Image
            src={ad.imageUrl}
            alt={ad.title ?? "Advertisement"}
            fill
            className="object-cover"
            sizes={placement === "banner" ? "728px" : "300px"}
          />
        </Link>
      ) : (
        <div
          className={`flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/50 ${size.className}`}
        >
          <span className="font-ui text-[11px] text-text-muted text-center px-4">
            {size.label}
          </span>
        </div>
      )}
    </aside>
  );
}

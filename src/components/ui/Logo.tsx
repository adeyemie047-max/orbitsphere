"use client";

import Link from "next/link";
import { useId } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md";
  /** White text on dark navbar, or ink on light surfaces */
  variant?: "masthead" | "default";
}

const ACCENT = "#E62E2D";
const ACCENT_LIGHT = "#FF6B6A";

function OrbitMark({
  size,
  masthead,
  gradId,
}: {
  size: number;
  masthead: boolean;
  gradId: string;
}) {
  const core = masthead ? "#ffffff" : "#111111";
  const ring = masthead ? ACCENT : ACCENT;
  const ringFaint = masthead ? "rgba(255,255,255,0.25)" : "rgba(230,46,45,0.25)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block shrink-0"
      aria-hidden
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={masthead ? "#ffffff" : "#444444"} />
          <stop offset="100%" stopColor={core} />
        </radialGradient>
        <filter id={`${gradId}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Static faint orbit track */}
      <circle cx="20" cy="20" r="16" stroke={ringFaint} strokeWidth="1" fill="none" />

      {/* Counter-rotating inner ring */}
      <circle
        className="logo-ring-inner"
        cx="20"
        cy="20"
        r="12"
        stroke={ringFaint}
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="14 24"
        fill="none"
      />

      {/* Primary orbit ring + satellite */}
      <g className="logo-orbit-group" filter={`url(#${gradId}-glow)`}>
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke={ring}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="28 18"
          fill="none"
          opacity="0.95"
        />
        <circle cx="20" cy="4" r="2.75" fill={ACCENT_LIGHT} />
      </g>

      {/* Core sphere */}
      <circle cx="20" cy="20" r="7" fill={`url(#${gradId})`} />
      <circle cx="20" cy="20" r="7" stroke={masthead ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export default function Logo({ size = "md", variant = "default" }: LogoProps) {
  const gradId = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isMasthead = variant === "masthead";
  const markSize = size === "sm" ? 34 : 42;
  const showDarkDefault = !isMasthead && isDark;

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 max-w-[min(100%,240px)] sm:max-w-none"
    >
      <span className="shrink-0 scale-90 sm:scale-100 origin-left transition-transform group-hover:scale-105">
        <OrbitMark size={markSize} masthead={isMasthead || showDarkDefault} gradId={gradId} />
      </span>
      <div className="min-w-0">
        <span
          className={cn(
            "font-ui font-bold tracking-tight leading-none block truncate",
            size === "sm" ? "text-base sm:text-lg" : "text-lg sm:text-[22px]",
            isMasthead ? "text-white" : "text-foreground"
          )}
        >
          Orbit
          <span className="text-[var(--ds-accent)]">Sphere</span>
        </span>
        <span
          className={cn(
            "hidden sm:block font-ui font-medium tracking-[0.16em] uppercase leading-none mt-1 truncate text-[9px]",
            isMasthead ? "text-white/55" : "text-text-muted"
          )}
        >
          Independent · African
        </span>
      </div>
    </Link>
  );
}

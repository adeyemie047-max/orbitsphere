import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import { cn } from "@/lib/utils";
import type { SiteBrandingData } from "@/lib/site-branding";
import { DEFAULT_SITE_BRANDING } from "@/lib/site-branding";

interface LogoProps {
  size?: "sm" | "md";
  /** Light nav (default) or dark footer */
  variant?: "masthead" | "footer" | "default";
  /** Destination when clickable. Set linked={false} to render without a wrapper link. */
  href?: string;
  linked?: boolean;
  branding?: Pick<
    SiteBrandingData,
    | "siteNamePrimary"
    | "siteNameAccent"
    | "siteTagline"
    | "logoUrl"
    | "accentColor"
    | "inkColor"
    | "paperColor"
  >;
}

const GRAD_IDS = {
  masthead: "orbitsphere-grad-masthead",
  footer: "orbitsphere-grad-footer",
  default: "orbitsphere-grad-default",
} as const;

function OrbitMark({
  size,
  onDark,
  gradId,
  accentColor,
  inkColor,
  paperColor,
}: {
  size: number;
  onDark: boolean;
  gradId: string;
  accentColor: string;
  inkColor: string;
  paperColor: string;
}) {
  const core = onDark ? paperColor : inkColor;
  const ringFaint = onDark ? `${accentColor}38` : `${inkColor}1F`;
  const ringAccent = accentColor;

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
        <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor={onDark ? "#ffffff" : "#3a3a3a"} />
          <stop offset="55%" stopColor={onDark ? "#d4d4d4" : "#1a1a1a"} />
          <stop offset="100%" stopColor={core} />
        </radialGradient>
        <linearGradient id={`${gradId}-orbit`} x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <circle cx="20" cy="20" r="17.5" stroke={ringFaint} strokeWidth="0.75" fill="none" />

      <circle
        className="logo-ring-inner"
        cx="20"
        cy="20"
        r="13"
        stroke={ringFaint}
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeDasharray="12 20"
        fill="none"
      />

      <g className="logo-orbit-group">
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke={`url(#${gradId}-orbit)`}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeDasharray="26 20"
          fill="none"
        />
        <circle cx="20" cy="3" r="3" fill={ringAccent} />
        <circle cx="20" cy="3" r="1.25" fill={onDark ? inkColor : paperColor} opacity="0.35" />
      </g>

      <circle cx="20" cy="20" r="8" fill={`url(#${gradId})`} />
      <circle
        cx="18"
        cy="18"
        r="2.5"
        fill={onDark ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}
      />
      <circle
        cx="20"
        cy="20"
        r="8"
        stroke={onDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}

/** Server-rendered logo — stable markup avoids Turbopack hydration drift. */
export default function Logo({
  size = "md",
  variant = "default",
  href = "/",
  linked = true,
  branding,
}: LogoProps) {
  const b = branding ?? DEFAULT_SITE_BRANDING;
  const onDark = variant === "footer";
  const isMasthead = variant === "masthead" || variant === "footer";
  const markSize = size === "sm" ? 40 : 48;
  const pad = size === "sm" ? "p-1.5" : "p-2";
  const gradId = GRAD_IDS[variant === "default" ? "default" : variant];

  const mark = b.logoUrl ? (
    <span
      className={cn("site-logo-mark shrink-0 origin-left relative block", pad)}
      style={{ width: markSize, height: markSize }}
    >
      <EditorialImage
        src={b.logoUrl}
        alt={`${b.siteNamePrimary}${b.siteNameAccent} logo`}
        fill
        className="object-contain"
        sizes={`${markSize}px`}
      />
    </span>
  ) : (
    <span className={cn("site-logo-mark shrink-0 origin-left", pad)}>
      <OrbitMark
        size={markSize}
        onDark={onDark}
        gradId={gradId}
        accentColor={b.accentColor}
        inkColor={b.inkColor}
        paperColor={b.paperColor}
      />
    </span>
  );

  const inner = (
    <>
      {mark}
      <div className="min-w-0">
        <span
          className={cn(
            "site-logo-wordmark leading-none block truncate",
            size === "sm" ? "text-xl sm:text-[22px]" : "text-[22px] sm:text-[26px]",
            onDark ? "text-[var(--ds-paper,#F5F5F0)]" : "text-[var(--ds-ink,#0A0A0A)]"
          )}
        >
          {b.siteNamePrimary}
          <span className={cn(onDark ? "text-[var(--ds-accent)] ml-1" : "site-logo-sphere-pill")}>
            {b.siteNameAccent}
          </span>
        </span>
        {isMasthead && b.siteTagline && (
          <span
            className={cn(
              "hidden sm:block font-ui font-semibold tracking-[0.18em] uppercase leading-none mt-1.5 truncate text-[9px]",
              onDark ? "text-[var(--ds-footer-muted)]" : "text-[var(--ds-text-muted)]"
            )}
          >
            {b.siteTagline}
          </span>
        )}
      </div>
    </>
  );

  const className =
    "group flex items-center gap-3 sm:gap-3.5 shrink-0 min-w-0 max-w-[min(100%,260px)] sm:max-w-none";

  if (!linked) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

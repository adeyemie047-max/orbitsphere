import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
  size?: number;
};

function IconShell({
  className,
  size = 16,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block shrink-0 align-middle", className)}
      style={{ width: size, height: size, maxWidth: size, maxHeight: size }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

const icons: Record<string, (props: IconProps) => React.JSX.Element> = {
  landmark: (p) => (
    <IconShell {...p}>
      <path d="M4 21h16M7 21V10l5-3.5L17 10v11M10 21v-5h4v5" />
    </IconShell>
  ),
  "building-2": (p) => (
    <IconShell {...p}>
      <path d="M7 21V9l5-2.5L17 9v12M10 21v-3h1M13 21v-3h1M10 12h1M13 12h1" />
    </IconShell>
  ),
  "trending-up": (p) => (
    <IconShell {...p}>
      <path d="M4 17l5-4.5 3.5 2.5L20 7M16 7h4v4" />
    </IconShell>
  ),
  cpu: (p) => (
    <IconShell {...p}>
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <path d="M10 8V6M14 8V6M10 18v2M14 18v2M8 10H6M8 14H6M18 10h-2M18 14h-2" />
    </IconShell>
  ),
  "graduation-cap": (p) => (
    <IconShell {...p}>
      <path d="M12 4 3 9l9 5 9-5-9-5Z" />
      <path d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
    </IconShell>
  ),
  wheat: (p) => (
    <IconShell {...p}>
      <path d="M12 21V10M12 10c-1.5-1.5-3-.5-3 1s1.5 2.5 3 1M12 10c1.5-1.5 3-.5 3 1s-1.5 2.5-3 1" />
    </IconShell>
  ),
  music: (p) => (
    <IconShell {...p}>
      <path d="M10 19V7l8-2v10" />
      <circle cx="8" cy="19" r="2" />
      <circle cx="16" cy="17" r="2" />
    </IconShell>
  ),
  trophy: (p) => (
    <IconShell {...p}>
      <path d="M9 5h6v2a3 3 0 0 1-6 0V5ZM6 6h2M16 6h2M10 19h4M11 15h2v4h-2z" />
    </IconShell>
  ),
  "message-square": (p) => (
    <IconShell {...p}>
      <path d="M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7l-4 3v-3H6a1 1 0 0 1-1-1V6Z" />
    </IconShell>
  ),
  heart: (p) => (
    <IconShell {...p}>
      <path d="M12 19s-6-3.5-6-8.5a3.5 3.5 0 0 1 6-2 3.5 3.5 0 0 1 6 2C18 15.5 12 19 12 19Z" />
    </IconShell>
  ),
  church: (p) => (
    <IconShell {...p}>
      <path d="M12 4v3M10.5 6h3M9 21h6M8 21V12l4-2.5L16 12v9" />
    </IconShell>
  ),
  newspaper: (p) => (
    <IconShell {...p}>
      <path d="M6 5h12a1 1 0 0 1 1 1v12l-2.5-1.5L14 18l-2-1.5-2 1.5-2.5-1.5L5 18V6a1 1 0 0 1 1-1Z" />
      <path d="M9 9h6M9 12h6" />
    </IconShell>
  ),
};

export const CATEGORY_ICON_KEYS: Record<string, string> = {
  politics: "landmark",
  metro: "building-2",
  business: "trending-up",
  technology: "cpu",
  education: "graduation-cap",
  agriculture: "wheat",
  entertainment: "music",
  sports: "trophy",
  opinion: "message-square",
  lifestyle: "heart",
  "faith-culture": "church",
};

export function resolveCategoryIconKey(slug: string, dbIcon?: string | null): string {
  if (dbIcon && icons[dbIcon]) return dbIcon;
  return CATEGORY_ICON_KEYS[slug] ?? "newspaper";
}

interface CategoryIconProps extends IconProps {
  name: string;
}

/** Small editorial section mark — fixed pixel size, never scales with layout. */
export default function CategoryIcon({ name, className, size = 16 }: CategoryIconProps) {
  const Icon = icons[name] ?? icons.newspaper;
  return <Icon className={className} size={size} />;
}

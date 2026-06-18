import Link from "next/link";
import type { Category } from "@/lib/types";
import type { PublicArticle } from "@/lib/articles-db";
import { cn } from "@/lib/utils";

const colorMap = {
  gold: "bg-[var(--ds-accent)] text-[var(--ds-on-accent)] border-transparent",
  cyan: "bg-transparent text-[var(--ds-text-secondary)] border-[var(--ds-border)]",
  blue: "bg-transparent text-[var(--ds-text-secondary)] border-[var(--ds-border)]",
  breaking: "bg-[var(--ds-badge-bg)] text-[var(--ds-on-badge)] border-transparent",
  live: "bg-[var(--ds-badge-bg)] text-[var(--ds-badge-fg)] border-transparent",
};

type BadgeColor = keyof typeof colorMap;

export function resolveCategoryColor(color: string | null | undefined): BadgeColor {
  if (color && color in colorMap) return color as BadgeColor;
  return "gold";
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeColor;
  className?: string;
}

export default function Badge({
  children,
  variant = "gold",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block font-ui text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-[var(--radius-sm)] border",
        colorMap[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

type CategoryLike = Category | PublicArticle["category"];

interface CategoryBadgeProps {
  category: CategoryLike;
  breaking?: boolean;
  className?: string;
  linked?: boolean;
}

export function CategoryBadge({
  category,
  breaking,
  className,
  linked = false,
}: CategoryBadgeProps) {
  const badge = (
    <Badge
      variant={breaking ? "breaking" : resolveCategoryColor(category.color)}
      className={className}
    >
      {breaking ? "Breaking" : category.name}
    </Badge>
  );

  if (linked) {
    return <Link href={`/${category.slug}`}>{badge}</Link>;
  }

  return badge;
}

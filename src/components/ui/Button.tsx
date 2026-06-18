import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

const variants = {
  primary:
    "bg-[var(--ds-button-bg)] text-[var(--ds-button-fg)] hover:opacity-95 border border-transparent rounded-[var(--radius-sm)] shadow-[0_2px_12px_rgba(10,10,10,0.15)] hover:shadow-[0_4px_20px_rgba(10,10,10,0.2)]",
  gold:
    "bg-[var(--ds-accent)] text-[var(--ds-ink)] hover:bg-[var(--ds-accent-hover)] border border-transparent font-bold rounded-[var(--radius-sm)] shadow-[0_2px_12px_rgba(200,255,0,0.35)] hover:shadow-[0_4px_20px_rgba(200,255,0,0.25)]",
  outline:
    "bg-transparent text-foreground border border-border hover:border-[var(--ds-ink)] hover:text-[var(--ds-ink)] rounded-[var(--radius-sm)]",
  ghost:
    "bg-transparent text-foreground border border-border hover:bg-surface-2 rounded-[var(--radius-sm)]",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-[13px]",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-ui font-semibold cursor-pointer transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-accent)]",
    "disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

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
    "bg-[var(--ds-button-bg)] text-[var(--ds-button-fg)] hover:opacity-90 border border-transparent",
  gold:
    "bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)] border border-transparent",
  outline:
    "bg-transparent text-foreground border border-foreground hover:bg-surface-2",
  ghost:
    "bg-transparent text-foreground border border-border hover:bg-surface-2",
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
    "inline-flex items-center justify-center gap-2 font-ui font-semibold rounded-sm cursor-pointer transition-colors duration-200 tracking-wide",
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

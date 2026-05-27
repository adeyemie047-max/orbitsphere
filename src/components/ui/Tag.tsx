import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export default function Tag({ children, href, className, onClick }: TagProps) {
  const classes = cn(
    "inline-flex font-ui text-[11px] font-medium px-3.5 py-1.5 rounded-full",
    "bg-surface-2 border border-border-subtle text-text-secondary",
    "transition-all duration-200 tracking-wide",
    "hover:bg-[rgba(212,175,55,0.15)] hover:border-[rgba(212,175,55,0.3)] hover:text-gold",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

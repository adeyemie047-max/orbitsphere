import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-[13px]",
  lg: "w-[52px] h-[52px] text-lg",
};

export default function Avatar({ initials, size = "sm", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-[var(--ds-accent-muted)] border border-[var(--ds-accent-border)] flex items-center justify-center font-ui font-semibold text-[var(--ds-accent)] shrink-0",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

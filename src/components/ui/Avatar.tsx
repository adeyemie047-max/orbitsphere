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
        "rounded-full bg-gradient-to-br from-[rgba(212,175,55,0.15)] to-midnight-mid border-[1.5px] border-gold flex items-center justify-center font-[family-name:var(--font-ui)] font-semibold text-gold shrink-0",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

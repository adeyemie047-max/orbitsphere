import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-surface via-surface-2 to-surface bg-[length:400px_100%] animate-[shimmer_1.6s_infinite_linear]",
        className
      )}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border-subtle rounded-[var(--radius-card)] overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

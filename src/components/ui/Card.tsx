import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-7",
};

export default function Card({
  children,
  className,
  hover = true,
  padding = "none",
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border-subtle rounded-[var(--radius-card)] overflow-hidden transition-all duration-300",
        hover &&
          "hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] hover:border-[rgba(212,175,55,0.2)]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

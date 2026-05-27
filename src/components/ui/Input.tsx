import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="font-ui text-xs font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full bg-surface border border-border rounded-lg px-4 py-3",
          "font-ui text-sm text-foreground placeholder:text-text-muted",
          "outline-none transition-all duration-200",
          "focus:border-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.2)]",
          error && "border-breaking focus:border-breaking focus:ring-[rgba(239,68,68,0.2)]",
          className
        )}
        {...props}
      />
      {error && (
        <span className="font-ui text-xs text-breaking" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

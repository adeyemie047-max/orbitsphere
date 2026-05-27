import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;

const headingStyles: Record<HeadingLevel, string> = {
  1: "font-serif text-[2rem] md:text-[3rem] font-bold leading-[1.2] tracking-tight text-foreground",
  2: "font-serif text-[1.625rem] md:text-[2.25rem] font-bold leading-[1.2] text-foreground",
  3: "font-serif text-xl md:text-2xl font-bold leading-[1.2] text-foreground",
  4: "font-serif text-lg font-bold leading-[1.3] text-foreground",
};

interface HeadingProps {
  level?: HeadingLevel;
  as?: `h${HeadingLevel}`;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level = 1, as, children, className }: HeadingProps) {
  const Tag = as ?? (`h${level}` as `h${HeadingLevel}`);
  return <Tag className={cn(headingStyles[level], className)}>{children}</Tag>;
}

interface TextProps {
  variant?: "body" | "body-sm" | "caption" | "lead";
  as?: "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
}

const textVariants = {
  body: "font-sans text-[0.9375rem] md:text-base leading-[1.7] text-text-secondary",
  "body-sm": "font-sans text-sm leading-[1.65] text-text-secondary",
  caption: "font-sans text-[0.8125rem] leading-normal text-text-muted",
  lead: "font-sans text-[0.9375rem] md:text-base leading-[1.7] text-text-secondary max-w-prose",
};

export function Text({
  variant = "body",
  as: Tag = "p",
  children,
  className,
}: TextProps) {
  return <Tag className={cn(textVariants[variant], className)}>{children}</Tag>;
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProps) {
  const classes = cn(
    "font-ui text-[11px] font-semibold tracking-[0.18em] uppercase text-gold",
    className
  );

  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={cn(classes, "cursor-pointer")}>
        {children}
      </label>
    );
  }

  return <span className={classes}>{children}</span>;
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-[1.875rem] font-black leading-none text-foreground",
        className
      )}
    >
      {children}
    </h2>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function legalMetadata(title: string, description: string): Metadata {
  return { title, description };
}

export default function LegalPageLayout({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="container-main py-12 sm:py-16 md:py-20 max-w-3xl">
      <div className="gold-rule" />
      <p className="font-ui text-xs text-text-muted uppercase tracking-widest mb-3">
        Last updated {lastUpdated}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl font-black text-foreground mb-3">
        {title}
      </h1>
      <p className="text-text-secondary text-base leading-relaxed mb-10">{description}</p>
      <article className="legal-prose space-y-6 text-text-secondary text-[15px] leading-[1.82]">
        {children}
      </article>
      <nav
        aria-label="Legal pages"
        className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 font-ui text-sm"
      >
        {[
          { href: "/privacy", label: "Privacy" },
          { href: "/terms", label: "Terms" },
          { href: "/cookies", label: "Cookies" },
          { href: "/corrections", label: "Corrections" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="text-[var(--ds-accent)] hover:underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

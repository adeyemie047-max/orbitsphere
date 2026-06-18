import Link from "next/link";
import { categories } from "@/lib/data";
import Logo from "@/components/ui/Logo";
import type { SiteBrandingData } from "@/lib/site-branding";

const footerLinks = {
  news: categories.filter((c) =>
    ["politics", "business", "technology", "metro", "sports", "entertainment"].includes(c.slug)
  ),
  features: categories.filter((c) =>
    ["opinion", "agriculture", "faith-culture"].includes(c.slug)
  ),
  company: [
    { name: "About Us", href: "/about" },
    { name: "Advertise", href: "/advertise" },
    { name: "Premium", href: "/premium" },
    { name: "Contact", href: "/about" },
    { name: "Citizen Journalism", href: "/submit" },
  ],
};

const SOCIAL_LABELS: Record<keyof Pick<
  SiteBrandingData,
  "twitterUrl" | "facebookUrl" | "linkedinUrl" | "youtubeUrl" | "instagramUrl"
>, string> = {
  twitterUrl: "Twitter / X",
  facebookUrl: "Facebook",
  linkedinUrl: "LinkedIn",
  youtubeUrl: "YouTube",
  instagramUrl: "Instagram",
};

export default function Footer({ branding }: { branding: SiteBrandingData }) {
  const socialLinks = (
    [
      ["twitterUrl", "𝕏"],
      ["facebookUrl", "f"],
      ["linkedinUrl", "in"],
      ["youtubeUrl", "▶"],
      ["instagramUrl", "◎"],
    ] as const
  ).filter(([key]) => branding[key]);

  return (
    <footer className="site-footer site-footer--animated mt-auto">
      <div className="container-main">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 xl:gap-12 py-12 sm:py-14">
          <div className="sm:col-span-2 xl:col-span-1">
            <Logo size="sm" variant="footer" branding={branding} />
            <p className="text-[13px] sm:text-sm text-[var(--ds-footer-muted)] leading-[1.75] my-4 max-w-sm">
              {branding.footerDescription}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map(([key, icon]) => (
                  <a
                    key={key}
                    href={branding[key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-[rgba(245,245,240,0.18)] flex items-center justify-center font-ui text-[11px] text-[rgba(245,245,240,0.65)] hover:border-[var(--ds-accent)] hover:text-[var(--ds-accent)] transition-colors rounded-[var(--radius-sm)]"
                    aria-label={SOCIAL_LABELS[key]}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-ui text-[10px] font-bold tracking-[0.14em] uppercase text-[rgba(245,245,240,0.4)] mb-4">
              News
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.news.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="font-ui text-[13px] text-[var(--ds-footer-text)] hover:text-[var(--ds-accent)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-ui text-[10px] font-bold tracking-[0.14em] uppercase text-[rgba(245,245,240,0.4)] mb-4">
              Features
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.features.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="font-ui text-[13px] text-[var(--ds-footer-text)] hover:text-[var(--ds-accent)] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-ui text-[10px] font-bold tracking-[0.14em] uppercase text-[rgba(245,245,240,0.4)] mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-ui text-[13px] text-[var(--ds-footer-text)] hover:text-[var(--ds-accent)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 py-6 border-t border-[rgba(245,245,240,0.1)] font-ui text-xs text-[rgba(245,245,240,0.45)]">
          <span>
            © {branding.copyrightYear} {branding.copyrightName}. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Cookie Settings", href: "/cookies" },
              { label: "Corrections", href: "/corrections" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-[var(--ds-accent)] transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

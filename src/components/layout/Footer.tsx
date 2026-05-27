import Link from "next/link";
import { categories } from "@/lib/data";
import Logo from "@/components/ui/Logo";
import NewsletterForm from "@/components/shared/NewsletterForm";

const footerLinks = {
  news: categories.filter((c) =>
    ["politics", "business", "technology", "metro", "sports", "entertainment"].includes(c.slug)
  ),
  features: categories.filter((c) =>
    ["opinion", "agriculture", "faith-culture"].includes(c.slug)
  ),
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about" },
    { name: "Advertise", href: "/about" },
    { name: "Careers", href: "/about" },
    { name: "Contact", href: "/about" },
    { name: "Citizen Journalism", href: "/submit" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[var(--ds-navbar-bg)] text-[var(--ds-nav-text)] border-t-4 border-[var(--ds-accent)] pt-12 pb-8 mt-10">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Logo size="sm" variant="masthead" />
            <p className="text-[13px] text-[var(--ds-nav-text)] leading-[1.75] my-4 max-w-sm">
              OrbitSphere is Nigeria&apos;s premier digital newspaper — delivering fearless,
              intelligent journalism that keeps Africa informed, engaged, and empowered in the
              21st century.
            </p>
            <div className="flex gap-2.5">
              {["𝕏", "f", "in", "▶", "📸"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 border border-[var(--ds-nav-border)] flex items-center justify-center font-ui text-[12px] hover:bg-[var(--ds-nav-hover-bg)] hover:text-white transition-colors"
                  aria-label={`Social link ${icon}`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-[family-name:var(--font-ui)] text-xs font-bold tracking-[0.14em] uppercase text-white mb-5">
              News
            </div>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.news.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="font-ui text-[13px] text-[var(--ds-nav-text)] hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-[family-name:var(--font-ui)] text-xs font-bold tracking-[0.14em] uppercase text-white mb-5">
              Features
            </div>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.features.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="font-ui text-[13px] text-[var(--ds-nav-text)] hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/" className="font-ui text-[13px] text-[var(--ds-nav-text)] hover:text-white transition-colors">
                  Video
                </Link>
              </li>
              <li>
                <Link href="/" className="font-ui text-[13px] text-[var(--ds-nav-text)] hover:text-white transition-colors">
                  Podcasts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-[family-name:var(--font-ui)] text-xs font-bold tracking-[0.14em] uppercase text-white mb-5">
              Company
            </div>
            <ul className="flex flex-col gap-2.5 list-none">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-ui text-[13px] text-[var(--ds-nav-text)] hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 border-t border-[var(--ds-nav-border)] font-ui text-xs text-[var(--ds-nav-text)]">
          <span>© 2026 OrbitSphere Media Limited. All rights reserved.</span>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Cookie Settings", href: "/cookies" },
              { label: "Corrections", href: "/corrections" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

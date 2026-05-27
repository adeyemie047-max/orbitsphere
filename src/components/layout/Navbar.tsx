"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navCategories, moreCategories } from "@/lib/data";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import NavbarAuth from "@/components/layout/NavbarAuth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (slug: string) => pathname === `/${slug}`;

  const navLink = (active: boolean) =>
    cn(
      "font-ui text-[12px] font-medium px-3 py-2 transition-colors",
      active
        ? "text-[var(--ds-nav-text-active)] bg-[var(--ds-nav-hover-bg)]"
        : "text-[var(--ds-nav-text)] hover:text-[var(--ds-nav-text-active)] hover:bg-[var(--ds-nav-hover-bg)]"
    );

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-100 border-b border-[var(--ds-nav-border)] bg-[var(--ds-navbar-bg)]">
      <div className="hidden md:block border-b border-[var(--ds-nav-border)]">
        <div className="container-main py-1.5 flex items-center justify-between font-ui text-[10px] tracking-[0.18em] uppercase text-[var(--ds-nav-text)]">
          <span>Lagos · Abuja · London</span>
          <span suppressHydrationWarning>{today}</span>
          <span>Today&apos;s Edition</span>
        </div>
      </div>

      <nav aria-label="Main navigation">
        <div className="container-main flex items-center justify-between gap-2 min-h-14 sm:min-h-16 py-2 sm:py-0">
          <Logo variant="masthead" />

          <ul className="hidden lg:flex items-center list-none">
            <li>
              <Link href="/" className={navLink(pathname === "/")}>
                Home
              </Link>
            </li>
            {navCategories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/${cat.slug}`} className={navLink(isActive(cat.slug))}>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={cn(navLink(false), "cursor-pointer bg-transparent border-none")}
              >
                More ▾
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-0 bg-surface border border-border py-1 min-w-[180px] shadow-[var(--shadow-card)] z-50">
                  {moreCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 font-ui text-[13px] text-text-secondary hover:text-[var(--ds-accent)] hover:bg-surface-2"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 flex items-center justify-center text-[var(--ds-nav-text)] hover:text-[var(--ds-nav-text-active)]"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <ThemeToggle />
            <NavbarAuth />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-[var(--ds-nav-text)]"
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-5 h-5">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-[var(--ds-nav-border)] px-6 py-3 bg-[var(--ds-navbar-bg)]">
            <form action="/search" method="GET" className="container-main flex gap-2">
              <input
                name="q"
                type="search"
                placeholder="Search articles, topics, authors…"
                autoFocus
                className="flex-1 bg-white/10 border border-[var(--ds-nav-border)] px-4 py-2.5 font-ui text-sm text-white placeholder:text-white/40 outline-none focus:border-white/35"
              />
              <Button type="submit" size="sm" variant="gold">
                Search
              </Button>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="lg:hidden border-t border-[var(--ds-nav-border)] bg-[var(--ds-navbar-bg)] px-6 py-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className={cn(navLink(pathname === "/"), "block py-2.5 border-b border-[var(--ds-nav-border)]")}>
              Home
            </Link>
            {[...navCategories, ...moreCategories].map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className={cn(navLink(isActive(cat.slug)), "block py-2.5 border-b border-[var(--ds-nav-border)]")}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/feed" onClick={() => setMenuOpen(false)} className={cn(navLink(false), "block py-2.5 border-b border-[var(--ds-nav-border)]")}>
              My Feed
            </Link>
            <Link href="/trending" onClick={() => setMenuOpen(false)} className={cn(navLink(false), "block py-2.5 border-b border-[var(--ds-nav-border)]")}>
              Trending
            </Link>
            <Link href="/submit" onClick={() => setMenuOpen(false)} className={cn(navLink(false), "block py-2.5 border-b border-[var(--ds-nav-border)]")}>
              Submit a Story
            </Link>
            <div className="pt-4">
              <Button href="/sign-in" variant="gold" size="sm" className="w-full justify-center">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

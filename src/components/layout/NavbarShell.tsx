"use client";

import Link from "next/link";
import { navCategories, moreCategories } from "@/lib/data";
import Button from "@/components/ui/Button";
import NavbarAuth from "@/components/layout/NavbarAuth";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useNavbar } from "@/components/layout/NavbarContext";
import { cn } from "@/lib/utils";

/** Nav links + toolbar — no outer shell div (server renders stable layout). */
export function NavbarNavLinks() {
  const { pathname, moreOpen, setMoreOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen, moreRef } =
    useNavbar();

  const navLink = (active: boolean) =>
    cn("site-navbar-link", active && "site-navbar-link--active");

  return (
    <>
      <ul className="hidden lg:flex items-center gap-7 list-none">
        <li>
          <Link href="/" className={navLink(pathname === "/")}>
            Home
          </Link>
        </li>
        {navCategories.slice(0, 5).map((cat) => (
          <li key={cat.slug}>
            <Link href={`/${cat.slug}`} className={navLink(pathname === `/${cat.slug}`)}>
              {cat.name}
            </Link>
          </li>
        ))}
        <li className="relative" ref={moreRef}>
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-haspopup="true"
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(navLink(false), "cursor-pointer bg-transparent border-none")}
          >
            More ▾
          </button>
          {moreOpen && (
            <div
              role="menu"
              className="absolute top-full right-0 mt-2 bg-[var(--ds-paper)] border border-[var(--ds-border)] py-1 min-w-[200px] shadow-[var(--shadow-card-hover)] z-50 rounded-[var(--radius-card)]"
            >
              {[...navCategories.slice(5), ...moreCategories].map((cat) => (
                <Link
                  key={cat.slug}
                  role="menuitem"
                  href={`/${cat.slug}`}
                  onClick={() => setMoreOpen(false)}
                  className="block px-4 py-2.5 font-ui text-[13px] text-[var(--ds-text-secondary)] hover:text-[var(--ds-ink)] hover:bg-[var(--ds-hover-overlay)]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </li>
      </ul>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-9 h-9 flex items-center justify-center text-[var(--ds-nav-text)] hover:text-[var(--ds-ink)] transition-colors rounded-[var(--radius-sm)]"
          aria-label={searchOpen ? "Close search" : "Open search"}
          aria-expanded={searchOpen}
        >
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <NavbarAuth />
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-9 h-9 flex items-center justify-center text-[var(--ds-nav-text)]"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
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
    </>
  );
}

/** Expandable search + mobile menu panels. */
export function NavbarNavPanels() {
  const { pathname, menuOpen, setMenuOpen, searchOpen } = useNavbar();

  const navLink = (active: boolean) =>
    cn("site-navbar-link", active && "site-navbar-link--active");

  return (
    <>
      {searchOpen && (
        <div className="border-t border-[var(--ds-nav-border)] py-3 bg-[var(--ds-navbar-bg)] backdrop-blur-md">
          <form action="/search" method="GET" className="container-main flex gap-2">
            <input
              name="q"
              type="search"
              placeholder="Search articles, topics, authors…"
              autoFocus
              className="field-input flex-1"
            />
            <Button type="submit" size="sm" variant="primary">
              Search
            </Button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-[var(--ds-nav-border)] bg-[var(--ds-paper)] max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain">
          <div className="container-main py-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={cn(navLink(pathname === "/"), "block py-3.5 min-h-[44px] border-b border-[var(--ds-border)]")}
            >
              Home
            </Link>
            {[...navCategories, ...moreCategories].map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  navLink(pathname === `/${cat.slug}`),
                  "block py-3.5 min-h-[44px] border-b border-[var(--ds-border)]"
                )}
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 flex flex-col gap-2.5">
              <Button href="/sign-in" variant="outline" size="sm" className="w-full justify-center min-h-[44px]">
                Sign In
              </Button>
              <Button href="/premium" variant="primary" size="sm" className="w-full justify-center min-h-[44px]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

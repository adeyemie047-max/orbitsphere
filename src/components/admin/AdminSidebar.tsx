"use client";

import Link from "next/link";
import { useState } from "react";
import type { UserRole } from "@prisma/client";
import Logo from "@/components/ui/Logo";
import AdminNavLinks from "@/components/admin/AdminNavLinks";
import type { AdminNavItem } from "@/lib/admin-data";

interface AdminSidebarProps {
  role: UserRole;
  userName?: string;
  navItems?: AdminNavItem[];
}

export default function AdminSidebar({ role, userName, navItems }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-surface border-b border-white/6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-lg bg-white/5 border border-white/6 flex items-center justify-center text-text-secondary"
          aria-label="Open admin menu"
        >
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-5 h-5">
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-surface border-r border-white/6 overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
              <div>
                <Logo size="sm" />
                <span className="block font-[family-name:var(--font-ui)] text-[9px] font-semibold tracking-[0.22em] uppercase text-text-muted mt-1 ml-11">
                  Newsroom
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/6 flex items-center justify-center text-text-secondary"
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AdminNavLinks onNavigate={() => setMobileOpen(false)} role={role} navItems={navItems} />
            <div className="p-6 border-t border-white/6">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-[family-name:var(--font-ui)] text-xs text-text-muted hover:text-gold transition-colors"
              >
                ← Back to site
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-white/6 sticky top-0 h-screen overflow-y-auto shrink-0">
        <div className="px-6 py-6 border-b border-white/6">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
          <span className="block font-[family-name:var(--font-ui)] text-[9px] font-semibold tracking-[0.22em] uppercase text-text-muted mt-1 ml-11">
            Newsroom · {userName?.split(" ")[0] ?? "Editor"}
          </span>
        </div>

        <AdminNavLinks role={role} navItems={navItems} />

        <div className="mt-auto p-6 border-t border-white/6">
          <Link
            href="/"
            className="font-[family-name:var(--font-ui)] text-xs text-text-muted hover:text-gold transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { getNavItemsForRole, type AdminNavItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export const adminIcons: Record<string, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  message: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const groups = [
  { key: "main", label: "Main" },
  { key: "engage", label: "Engage" },
  { key: "settings", label: "Settings" },
] as const;

interface AdminNavLinksProps {
  onNavigate?: () => void;
  role?: UserRole;
  navItems?: AdminNavItem[];
}

export default function AdminNavLinks({ onNavigate, role = "journalist", navItems }: AdminNavLinksProps) {
  const pathname = usePathname();
  const items = navItems ?? getNavItemsForRole(role);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {groups.map((group) => (
        <div key={group.key} className="mb-1">
          <div className="font-[family-name:var(--font-ui)] text-[10px] font-bold tracking-[0.18em] uppercase text-text-muted px-6 pt-3.5 pb-2">
            {group.label}
          </div>
          {items
            .filter((item) => item.group === group.key)
            .map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-6 py-2.5 font-[family-name:var(--font-ui)] text-[13px] font-medium border-l-[3px] transition-all",
                  isActive(item.href)
                    ? "text-gold border-gold bg-[rgba(212,175,55,0.05)]"
                    : "text-text-secondary border-transparent hover:text-white hover:bg-white/4"
                )}
              >
                {adminIcons[item.icon]}
                {item.label}
                {item.badge && (
                  <span className="ml-auto font-[family-name:var(--font-ui)] text-[10px] font-bold bg-breaking text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
        </div>
      ))}
    </>
  );
}

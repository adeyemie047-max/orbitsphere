import type { UserRole } from "@prisma/client";
import type { DashboardStat } from "./dashboard-data";

export type AdminStat = DashboardStat;

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  group: "main" | "engage" | "settings";
  badge?: number;
  icon: string;
  roles?: UserRole[];
}

export const adminNavItems: AdminNavItem[] = [
  { id: "overview", label: "Overview", href: "/dashboard", group: "main", icon: "grid" },
  { id: "articles", label: "Articles", href: "/dashboard/articles", group: "main", icon: "file" },
  { id: "write", label: "Write Article", href: "/dashboard/write", group: "main", icon: "edit" },
  {
    id: "review",
    label: "Review Queue",
    href: "/dashboard/review",
    group: "main",
    icon: "file",
    roles: ["admin", "editor"],
  },
  { id: "media", label: "Media Library", href: "/dashboard/media", group: "main", icon: "monitor" },
  {
    id: "comments",
    label: "Comments",
    href: "/dashboard/comments",
    group: "engage",
    icon: "message",
    roles: ["admin", "editor"],
  },
  {
    id: "citizen",
    label: "Citizen Stories",
    href: "/dashboard/citizen",
    group: "engage",
    icon: "edit",
    roles: ["admin", "editor"],
  },
  {
    id: "users",
    label: "Users",
    href: "/dashboard/users",
    group: "engage",
    icon: "users",
    roles: ["admin"],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    group: "engage",
    icon: "activity",
    roles: ["admin", "editor"],
  },
  {
    id: "ads",
    label: "Advertisements",
    href: "/dashboard/ads",
    group: "engage",
    icon: "ads",
    roles: ["admin"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    group: "settings",
    icon: "settings",
    roles: ["admin"],
  },
];

export function getNavItemsForRole(role: UserRole): AdminNavItem[] {
  return adminNavItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );
}

export const editorDefault = {
  title: "Dangote Refinery's First Year: A Revolution in African Energy Independence",
  body: "When the Dangote Petroleum Refinery opened its gates to full commercial operations in early 2025, few could have predicted the velocity of its impact on both the Nigerian economy and the wider African energy landscape. Twelve months on, the numbers tell a story that is simultaneously triumphant and cautionary.",
};

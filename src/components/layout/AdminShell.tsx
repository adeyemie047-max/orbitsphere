import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireDashboardSession } from "@/lib/auth-utils";
import { countPendingCitizenSubmissions } from "@/lib/admin-citizen";
import { canReviewCitizenSubmissions } from "@/lib/rbac";
import { getNavItemsForRole } from "@/lib/admin-data";

/** Editorial newsroom shell — sidebar + content area (PRD §8.5). */
export default async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireDashboardSession();

  let navBadges: Record<string, number> | undefined;
  if (canReviewCitizenSubmissions(session.role)) {
    const pending = await countPendingCitizenSubmissions();
    if (pending > 0) navBadges = { citizen: pending };
  }

  const navItems = getNavItemsForRole(session.role).map((item) =>
    navBadges?.[item.id] ? { ...item, badge: navBadges[item.id] } : item
  );

  return (
    <div className="site-admin min-h-screen flex flex-col lg:flex-row">
      <AdminSidebar role={session.role} userName={session.name} navItems={navItems} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

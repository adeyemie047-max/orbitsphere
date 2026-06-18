import { redirect } from "next/navigation";
import UsersManagerPanel from "@/components/dashboard/UsersManagerPanel";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canManageUsers } from "@/lib/rbac";

export default async function DashboardUsersPage() {
  const session = await requireDashboardSession("/dashboard/users");

  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Users
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg mb-8">
        Manage editorial staff, assign roles, and invite journalists by email.
      </p>
      <UsersManagerPanel />
    </main>
  );
}

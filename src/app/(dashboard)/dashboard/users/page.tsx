import { redirect } from "next/navigation";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canManageUsers } from "@/lib/rbac";

function DashboardPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        {title}
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg">
        {description}
      </p>
      <div className="mt-8 p-8 bg-surface border border-white/6 rounded-[14px] text-center">
        <p className="text-text-secondary text-sm">
          This section will be available in a future release with full backend integration.
        </p>
      </div>
    </main>
  );
}

export default async function DashboardUsersPage() {
  const session = await requireDashboardSession("/dashboard/users");

  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  return (
    <DashboardPlaceholder
      title="Users"
      description="Manage editorial staff, assign roles, and review reader accounts."
    />
  );
}

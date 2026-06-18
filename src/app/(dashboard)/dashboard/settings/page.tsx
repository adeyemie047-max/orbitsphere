import { redirect } from "next/navigation";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canManageUsers } from "@/lib/rbac";
import BrandingSettingsPanel from "@/components/dashboard/BrandingSettingsPanel";

export default async function DashboardSettingsPage() {
  const session = await requireDashboardSession("/dashboard/settings");

  if (!canManageUsers(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Settings
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg">
        Configure site branding, SEO defaults, and newsroom identity. Changes sync to the public site.
      </p>
      <BrandingSettingsPanel />
    </main>
  );
}

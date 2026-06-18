import { redirect } from "next/navigation";
import AdsManagerPanel from "@/components/dashboard/AdsManagerPanel";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canManageAds } from "@/lib/rbac";

export default async function DashboardAdsPage() {
  const session = await requireDashboardSession("/dashboard/ads");

  if (!canManageAds(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Advertisements
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-xl mb-8">
        Manage display campaigns, track impressions and clicks, and review partnership inquiries.
      </p>
      <AdsManagerPanel />
    </main>
  );
}

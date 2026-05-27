import { redirect } from "next/navigation";
import AdminPageviewsChart from "@/components/admin/AdminPageviewsChart";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import { requireDashboardSession } from "@/lib/auth-utils";
import { getDashboardAnalytics } from "@/lib/dashboard-data";
import { canViewAnalytics } from "@/lib/rbac";

export default async function DashboardAnalyticsPage() {
  const session = await requireDashboardSession("/dashboard/analytics");

  if (!canViewAnalytics(session.role)) {
    redirect("/dashboard");
  }

  const analytics = await getDashboardAnalytics(session.role);

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white">
          Analytics
        </h1>
        <p className="font-[family-name:var(--font-ui)] text-[13px] text-text-muted mt-1">
          Traffic, engagement, and readership insights
        </p>
      </div>
      <AdminStatsGrid stats={analytics.stats} />
      <AdminPageviewsChart data={analytics.pageviewTrend} />

      {analytics.topArticles.length > 0 && (
        <div className="bg-surface border border-white/6 rounded-[14px] p-7 mt-6">
          <h3 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white mb-4">
            Top articles by views
          </h3>
          <ul className="space-y-3">
            {analytics.topArticles.map((article, i) => (
              <li
                key={article.slug}
                className="flex items-center justify-between gap-4 font-[family-name:var(--font-ui)] text-sm"
              >
                <span className="text-text-muted w-6">{i + 1}.</span>
                <span className="text-text-primary flex-1 line-clamp-1">{article.title}</span>
                <span className="text-gold font-semibold">
                  {article.views.toLocaleString()} views
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

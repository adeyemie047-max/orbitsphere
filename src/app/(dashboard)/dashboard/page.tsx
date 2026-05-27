import Button from "@/components/ui/Button";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import AdminPageviewsChart from "@/components/admin/AdminPageviewsChart";
import ArticleManagerTable from "@/components/dashboard/ArticleManagerTable";
import { requireDashboardSession } from "@/lib/auth-utils";
import {
  getDashboardAnalytics,
  getDashboardArticles,
} from "@/lib/dashboard-data";
import { canWriteArticles } from "@/lib/rbac";

export default async function DashboardOverviewPage() {
  const session = await requireDashboardSession("/dashboard");

  const [analytics, { articles }] = await Promise.all([
    getDashboardAnalytics(session.role),
    getDashboardArticles(session.role, session.userId),
  ]);

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white">
            Newsroom Overview
          </h1>
          <p className="font-[family-name:var(--font-ui)] text-[13px] text-text-muted mt-1">
            {today} · Good morning, {session.name.split(" ")[0]}
          </p>
        </div>
        {canWriteArticles(session.role) && (
          <Button href="/dashboard/write">+ New Article</Button>
        )}
      </div>

      <AdminStatsGrid stats={analytics.stats} />
      <AdminPageviewsChart data={analytics.pageviewTrend} />
      <ArticleManagerTable        articles={articles.slice(0, 8)}
        userRole={session.role}
        userId={session.userId}
        title="Recent Articles"
        compact
      />
    </main>
  );
}

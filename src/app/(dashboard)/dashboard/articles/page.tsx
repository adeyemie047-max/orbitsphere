import Button from "@/components/ui/Button";
import ArticleManagerTable from "@/components/dashboard/ArticleManagerTable";
import { requireDashboardSession } from "@/lib/auth-utils";
import { getDashboardArticles } from "@/lib/dashboard-data";
import { canWriteArticles } from "@/lib/rbac";

export default async function DashboardArticlesPage() {
  const session = await requireDashboardSession("/dashboard/articles");
  const { articles } = await getDashboardArticles(session.role, session.userId);

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white">
            Articles
          </h1>
          <p className="font-[family-name:var(--font-ui)] text-[13px] text-text-muted mt-1">
            {session.role === "journalist"
              ? "Manage your draft and published stories"
              : "Manage all published, scheduled, and draft articles"}
          </p>
        </div>
        {canWriteArticles(session.role) && (
          <Button href="/dashboard/write">+ New Article</Button>
        )}
      </div>
      <ArticleManagerTable
        articles={articles}
        userRole={session.role}
        userId={session.userId}
      />
    </main>
  );
}

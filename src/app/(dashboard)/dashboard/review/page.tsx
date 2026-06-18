import { redirect } from "next/navigation";
import ReviewQueuePanel from "@/components/dashboard/ReviewQueuePanel";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canPublishArticle } from "@/lib/rbac";

export default async function DashboardReviewPage() {
  const session = await requireDashboardSession("/dashboard/review");

  if (!canPublishArticle(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Editorial Review
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg mb-8">
        Articles submitted by journalists awaiting editor approval before publication.
      </p>
      <ReviewQueuePanel />
    </main>
  );
}

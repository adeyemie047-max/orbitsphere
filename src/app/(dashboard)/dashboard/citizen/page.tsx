import { redirect } from "next/navigation";
import CitizenReviewPanel from "@/components/dashboard/CitizenReviewPanel";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canReviewCitizenSubmissions } from "@/lib/rbac";

export default async function DashboardCitizenPage() {
  const session = await requireDashboardSession("/dashboard/citizen");

  if (!canReviewCitizenSubmissions(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Citizen Submissions
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg mb-8">
        Review reader-submitted stories from the Submit a Story form.
      </p>
      <CitizenReviewPanel />
    </main>
  );
}

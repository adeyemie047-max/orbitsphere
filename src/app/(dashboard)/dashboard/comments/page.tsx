import { redirect } from "next/navigation";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canModerateComments } from "@/lib/rbac";

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

export default async function DashboardCommentsPage() {
  const session = await requireDashboardSession("/dashboard/comments");

  if (!canModerateComments(session.role)) {
    redirect("/dashboard");
  }

  return (
    <DashboardPlaceholder
      title="Comments"
      description="Review, approve, and moderate reader comments across all articles."
    />
  );
}

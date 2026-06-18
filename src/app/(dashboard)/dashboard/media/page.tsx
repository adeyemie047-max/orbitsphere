import { redirect } from "next/navigation";
import MediaLibraryPanel from "@/components/dashboard/MediaLibraryPanel";
import { requireDashboardSession } from "@/lib/auth-utils";
import { canWriteArticles } from "@/lib/rbac";

export default async function DashboardMediaPage() {
  const session = await requireDashboardSession("/dashboard/media");

  if (!canWriteArticles(session.role)) {
    redirect("/dashboard");
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="gold-rule" />
      <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white mb-2">
        Media Library
      </h1>
      <p className="font-[family-name:var(--font-ui)] text-sm text-text-muted max-w-lg mb-8">
        Upload and manage images for articles and branding. Click any item to copy its URL.
      </p>
      <MediaLibraryPanel />
    </main>
  );
}

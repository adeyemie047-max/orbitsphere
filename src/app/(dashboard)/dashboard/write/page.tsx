import { notFound, redirect } from "next/navigation";
import ArticleEditor from "@/components/editor/ArticleEditor";
import { requireDashboardSession } from "@/lib/auth-utils";
import {
  getArticleForEditor,
  getCategoriesForEditor,
} from "@/lib/articles-admin";
import { canWriteArticles } from "@/lib/rbac";

type PageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export default async function DashboardWritePage({ searchParams }: PageProps) {
  const session = await requireDashboardSession("/dashboard/write");

  if (!canWriteArticles(session.role)) {
    redirect("/dashboard");
  }

  const { edit } = await searchParams;
  const categories = await getCategoriesForEditor();

  if (categories.length === 0) {
    return (
      <main className="p-6 lg:p-8 overflow-y-auto">
        <p className="text-text-muted text-sm">
          No categories available. Run database seed before creating articles.
        </p>
      </main>
    );
  }

  const initial = edit
    ? await getArticleForEditor(edit, session.role, session.userId)
    : null;

  if (edit && !initial) {
    notFound();
  }

  return (
    <main className="p-6 lg:p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] font-black text-white">
          {initial ? "Edit Article" : "Write Article"}
        </h1>
        <p className="font-[family-name:var(--font-ui)] text-[13px] text-text-muted mt-1">
          {initial
            ? "Update your story — changes auto-save every few seconds"
            : "Create and publish a new story"}
        </p>
      </div>
      <ArticleEditor
        categories={categories}
        initial={initial}
        userRole={session.role}
        userId={session.userId}
      />
    </main>
  );
}

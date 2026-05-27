import Link from "next/link";
import { requireUserSessionPage } from "@/lib/auth-utils";
import { listBookmarks } from "@/lib/bookmarks";
import ArticleCard from "@/components/article/ArticleCard";

export const metadata = {
  title: "Saved Articles",
};

export default async function BookmarksPage() {
  const session = await requireUserSessionPage("/bookmarks");

  let bookmarks: Awaited<ReturnType<typeof listBookmarks>> = [];
  try {
    bookmarks = await listBookmarks(session.userId);
  } catch {
    /* empty */
  }

  return (
    <div className="container-main py-12">
      <h1 className="font-serif text-3xl font-black text-foreground mb-2">
        Saved Articles
      </h1>
      <p className="font-ui text-sm text-text-muted mb-8">
        Stories you&apos;ve bookmarked for later
      </p>

      {bookmarks.length === 0 ? (
        <div className="bg-surface border border-border rounded-[14px] p-12 text-center">
          <p className="text-text-secondary text-sm mb-4">
            No saved articles yet.
          </p>
          <Link href="/" className="text-gold text-sm hover:underline">
            Browse the homepage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <ArticleCard key={b.id} article={b.article} />
          ))}
        </div>
      )}
    </div>
  );
}

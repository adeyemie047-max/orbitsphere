import Link from "next/link";
import { requireUserSessionPage } from "@/lib/auth-utils";
import { getPersonalizedFeed } from "@/lib/feed";
import { getFeedPreferences } from "@/lib/users";
import ArticleCard from "@/components/article/ArticleCard";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Your Feed",
};

export default async function FeedPage() {
  const session = await requireUserSessionPage("/feed");

  let articles: Awaited<ReturnType<typeof getPersonalizedFeed>> = [];
  let preferences: Awaited<ReturnType<typeof getFeedPreferences>> = [];

  try {
    [articles, preferences] = await Promise.all([
      getPersonalizedFeed(session.userId, 24),
      getFeedPreferences(session.userId),
    ]);
  } catch {
    /* fallback empty */
  }

  return (
    <div className="container-main py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-black text-foreground mb-2">
            Your Feed
          </h1>
          <p className="font-ui text-sm text-text-muted">
            {preferences.length > 0
              ? `Personalized from ${preferences.length} followed categories`
              : "Follow categories in your profile to personalize this feed"}
          </p>
        </div>
        <Button href="/profile" variant="outline" size="sm">
          Edit preferences
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="bg-surface border border-border rounded-[14px] p-12 text-center">
          <p className="text-text-secondary text-sm mb-4">
            Your feed is empty. Pick some categories to get started.
          </p>
          <Link href="/profile" className="text-gold text-sm hover:underline">
            Set feed preferences
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

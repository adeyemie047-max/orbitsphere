import { getPublicArticles } from "@/lib/articles-db";
import { getTrendingArticles } from "@/lib/data";
import { mockToPublicFromArticle } from "@/lib/category-page-data";
import ArticleCard from "@/components/article/ArticleCard";

export const metadata = {
  title: "Trending Now",
};

export const revalidate = 60;

export default async function TrendingPage() {
  let articles;
  try {
    articles = await getPublicArticles({ trending: true, limit: 24 });
  } catch {
    articles = getTrendingArticles(24).map(mockToPublicFromArticle);
  }

  return (
    <div className="container-main py-12">
      <h1 className="font-serif text-3xl font-black text-foreground mb-2">
        Trending Now
      </h1>
      <p className="font-ui text-sm text-text-muted mb-8">
        The most-read stories on OrbitSphere right now
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <div key={article.id} className="relative">
            <span className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-gold text-midnight-deep font-ui text-sm font-black flex items-center justify-center">
              {i + 1}
            </span>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}

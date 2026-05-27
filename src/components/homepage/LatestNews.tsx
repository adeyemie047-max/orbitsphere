import type { Article } from "@/lib/types";
import ArticleCard from "@/components/article/ArticleCard";
import Button from "@/components/ui/Button";
import type { PublicArticle } from "@/lib/articles-db";

interface LatestNewsProps {
  articles: PublicArticle[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="pb-[70px]">
      <div className="container-main">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="gold-rule" />
            <h2 className="section-title">Latest News</h2>
          </div>
          <Button href="/search" variant="outline" size="sm">
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

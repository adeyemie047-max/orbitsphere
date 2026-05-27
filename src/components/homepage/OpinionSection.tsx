import Link from "next/link";
import type { PublicArticle } from "@/lib/articles-db";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

interface OpinionSectionProps {
  articles: PublicArticle[];
}

export default function OpinionSection({ articles }: OpinionSectionProps) {
  return (
    <section className="py-[60px]">
      <div className="container-main">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="gold-rule" />
            <h2 className="section-title">Opinion & Analysis</h2>
          </div>
          <Button href="/opinion" variant="outline" size="sm">
            All Opinion →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block"
            >
              <article className="relative bg-surface border border-white/6 rounded-[14px] p-7 transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-[rgba(212,175,55,0.25)]">
                <span className="absolute top-[18px] right-6 font-[family-name:var(--font-serif)] text-[80px] text-gold opacity-[0.12] leading-none pointer-events-none">
                  &ldquo;
                </span>
                <Avatar initials={article.author.initials} size="lg" className="mb-4" />
                <Badge
                  variant={
                    article.category.color === "cyan" ||
                    article.category.color === "blue" ||
                    article.category.color === "gold"
                      ? article.category.color
                      : "gold"
                  }
                  className="mb-3"
                >
                  {article.category.name}
                </Badge>
                <h3 className="font-[family-name:var(--font-serif-alt)] text-lg leading-[1.45] text-text-primary my-3 transition-colors group-hover:text-gold line-clamp-3">
                  {article.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-[1.7] mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="font-[family-name:var(--font-ui)] text-xs font-semibold text-gold">
                  {article.author.name}
                </div>
                <div className="font-[family-name:var(--font-ui)] text-[11px] text-text-muted">
                  {article.author.role} · {article.readTime ?? 5} min read
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { PublicArticle } from "@/lib/articles-db";
import Button from "@/components/ui/Button";
import { CategoryBadge } from "@/components/ui/Badge";

interface OpinionSectionProps {
  articles: PublicArticle[];
}

export default function OpinionSection({ articles }: OpinionSectionProps) {
  const items = articles.slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="section-block border-t border-[var(--ds-border)] reveal-on-scroll reveal-delay-3">
      <div className="container-main">
        <div className="section-header mb-8">
          <div>
            <p className="section-label mb-1">Perspectives</p>
            <h2 className="section-title">Opinion</h2>
          </div>
          <Button href="/opinion" variant="outline" size="sm">
            View all
          </Button>
        </div>

        <div className="editorial-grid editorial-grid--interactive editorial-grid--lift reveal-stagger grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block px-5 py-7 sm:px-7 sm:py-8 border-b sm:border-b-0 sm:border-r border-[var(--ds-border)] last:border-b-0 last:border-r-0 transition-all outline-none min-w-0 h-full"
            >
              <div className="opinion-avatar mb-4">{article.author.initials}</div>
              <p className="text-[13px] font-semibold text-[var(--ds-ink)]">
                {article.author.name}
              </p>
              <p className="text-[11px] text-[var(--ds-text-muted)] mb-3 capitalize">
                {article.author.role ?? "Contributor"}
              </p>
              <CategoryBadge category={article.category} className="mb-4 w-fit" />
              <p className="font-serif text-[17px] sm:text-[18px] italic leading-[1.45] text-[var(--ds-ink)] line-clamp-4 group-hover:opacity-90 transition-opacity mb-6">
                {article.title}
              </p>
              <p className="text-[11px] text-[var(--ds-text-muted)] mt-auto pt-4 border-t border-[var(--ds-border-subtle)]">
                {article.readTime ?? 5} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";

interface TrendingSectionProps {
  articles: PublicArticle[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  const [featured, ...rest] = articles;
  if (!featured) return null;

  const listItems = rest.slice(0, 5);

  return (
    <section className="section-block section-block--alt reveal-on-scroll reveal-delay-1">
      <div className="container-main">
        <div className="section-label-row mb-8">
          <h2 className="section-label">In Depth</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10 xl:gap-12 pb-2">
          <Link href={`/article/${featured.slug}`} className="group block min-w-0 card-lift">
            <div className="relative aspect-[16/9] sm:aspect-[16/10] bg-[var(--ds-surface-2)] overflow-hidden mb-5 sm:mb-6 rounded-[var(--radius-card)] card-image-shine shadow-[var(--shadow-card)]">
              {featured.featuredImage ? (
                <EditorialImage
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 720px"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--ds-surface-2)]" />
              )}
              <span className="absolute bottom-4 left-4 text-[10px] font-bold tracking-[0.12em] text-[var(--ds-badge-fg)] bg-[var(--ds-badge-bg)] px-2.5 py-1">
                {featured.category.name.toUpperCase()}
              </span>
            </div>
            <h3 className="font-serif text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.12] tracking-[-0.025em] text-[var(--ds-ink)] mb-3 story-link-hover pb-0.5">
              {featured.title}
            </h3>
            <p className="text-[15px] text-[var(--ds-text-secondary)] leading-[1.7] line-clamp-3 max-w-2xl">
              {featured.excerpt}
            </p>
            <p className="text-xs text-[var(--ds-text-muted)] mt-4">
              {formatRelativeTime(featured.publishedAt)} · {featured.readTime ?? 5} min read
            </p>
          </Link>

          <div className="flex flex-col min-w-0 editorial-grid editorial-grid--interactive editorial-grid--lift">
            {listItems.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="flex gap-4 items-start px-5 py-5 border-b border-[var(--ds-border)] last:border-b-0 transition-colors"
              >
                <span className="rank-badge shrink-0">{index + 1}</span>
                <div className="min-w-0">
                  <h4 className="font-serif text-[17px] leading-snug text-[var(--ds-ink)] line-clamp-3">
                    {article.title}
                  </h4>
                  <p className="text-xs text-[var(--ds-text-muted)] mt-1.5">
                    {formatRelativeTime(article.publishedAt)}
                  </p>
                </div>
              </Link>
            ))}
            <Link
              href="/trending"
              className="px-5 py-4 text-[13px] font-bold text-[var(--ds-ink)] bg-[var(--ds-accent-muted)] inline-flex items-center gap-2 hover:gap-3 transition-all border-t border-[var(--ds-border)]"
            >
              View all trending <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

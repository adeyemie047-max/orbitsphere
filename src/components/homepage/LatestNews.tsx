import Link from "next/link";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";

interface LatestNewsProps {
  articles: PublicArticle[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  const topStories = articles.slice(0, 3);

  return (
    <section className="section-block reveal-on-scroll reveal-delay-1">
      <div className="container-main">
        <div className="section-label-row mb-8">
          <h2 className="section-label">Today&apos;s Top Stories</h2>
        </div>

        <div className="editorial-grid editorial-grid--interactive editorial-grid--lift reveal-stagger grid-cols-1 md:grid-cols-3">
          {topStories.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block px-5 py-7 sm:px-8 sm:py-8 border-b md:border-b-0 md:border-r border-[var(--ds-border)] last:border-b-0 last:md:border-r-0 transition-all outline-none min-w-0"
            >
              <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--ds-text-muted)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-accent)] shrink-0" aria-hidden />
                {article.category.name}
              </p>
              <h3 className="font-serif text-[1.35rem] sm:text-[1.5rem] leading-[1.18] tracking-[-0.025em] text-[var(--ds-ink)] mb-3 story-link-hover pb-0.5">
                {article.title}
              </h3>
              <p className="text-[14px] text-[var(--ds-text-secondary)] leading-[1.65] line-clamp-3 mb-5">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--ds-border-subtle)]">
                <span className="text-xs text-[var(--ds-text-muted)]">
                  {formatRelativeTime(article.publishedAt)} · {article.readTime ?? 5} min
                </span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--ds-badge-bg)] text-[var(--ds-badge-fg)] text-sm font-bold opacity-80 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all group-hover:shadow-[var(--shadow-glow)]">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

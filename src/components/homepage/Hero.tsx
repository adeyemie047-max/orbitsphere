import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime, cn } from "@/lib/utils";

interface HeroProps {
  featured: PublicArticle;
  subArticles: PublicArticle[];
}

export default function Hero({ featured, subArticles }: HeroProps) {
  const sidebarStories = subArticles.slice(0, 3);

  return (
    <section className="hero-section hero-entrance">
      <div className="container-main py-6 sm:py-8 lg:py-10">
        <div className="hero-frame grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,420px)] min-h-0 lg:min-h-[480px] xl:min-h-[540px]">
          <div className="hero-entrance__copy flex flex-col justify-between px-5 py-8 sm:px-8 lg:px-10 lg:py-12 xl:py-14 border-b lg:border-b-0 lg:border-r border-[var(--ds-border)]">
            <div>
              <div
                className={cn(
                  "story-kicker mb-5 sm:mb-6",
                  featured.isBreaking && "story-kicker--breaking"
                )}
              >
                <span className="story-kicker-dot" aria-hidden />
                {featured.isBreaking ? "Breaking" : "Lead story"} · {featured.category.name}
              </div>
              <Link href={`/article/${featured.slug}`} className="group block">
                <h1 className="font-serif text-[clamp(1.875rem,5.5vw,4rem)] leading-[1.06] tracking-[-0.035em] font-normal text-[var(--ds-ink)] mb-4 sm:mb-5 story-link-hover pb-1">
                  {featured.title}
                </h1>
              </Link>
              <p className="reading-prose text-[var(--ds-text-secondary)] leading-[1.72] max-w-2xl mb-6 sm:mb-8">
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3">
                <p className="text-[13px] text-[var(--ds-text-muted)]">
                  By{" "}
                  <strong className="text-[var(--ds-ink)] font-semibold">
                    {featured.author.name}
                  </strong>
                  {featured.author.role ? ` · ${featured.author.role}` : ""}
                </p>
                <span className="hidden sm:inline text-[var(--ds-border)]">|</span>
                <p className="text-[13px] text-[var(--ds-text-muted)]">
                  {formatRelativeTime(featured.publishedAt)} · {featured.readTime ?? 5} min read
                </p>
              </div>
              <Link href={`/article/${featured.slug}`} className="btn-read mt-6 sm:mt-8">
                Read full story
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <aside className="hero-entrance__media flex flex-col min-h-0">
            <Link
              href={`/article/${featured.slug}`}
              className="group relative flex-1 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] hero-image-wrap"
            >
              {featured.featuredImage ? (
                <EditorialImage
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--ds-surface-2)]" />
              )}
              <span className="absolute bottom-4 left-4 z-10 text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--ds-badge-fg)] bg-[var(--ds-badge-bg)]/90 backdrop-blur-sm px-2.5 py-1 rounded-[var(--radius-sm)]">
                {featured.category.name}
              </span>
            </Link>

            {sidebarStories.length > 0 && (
              <div className="border-t border-[var(--ds-border)] bg-[var(--ds-hero-panel)]">
                <p className="px-5 sm:px-6 pt-4 sm:pt-5 pb-2 text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--ds-text-muted)]">
                  Also in the news
                </p>
                {sidebarStories.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className={cn(
                      "group block px-5 sm:px-6 py-3.5 sm:py-4 border-l-2 border-transparent hover:border-[var(--ds-accent)] hover:bg-[var(--ds-hover-overlay)] transition-all",
                      index < sidebarStories.length - 1 && "border-b border-[var(--ds-border)]"
                    )}
                  >
                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--ds-text-muted)] mb-1.5">
                      {article.category.name}
                    </p>
                    <h2 className="font-serif text-[15px] sm:text-base leading-snug text-[var(--ds-ink)] line-clamp-2 group-hover:text-[var(--ds-ink)]">
                      {article.title}
                    </h2>
                    <p className="text-xs text-[var(--ds-text-muted)] mt-1.5">
                      {formatRelativeTime(article.publishedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

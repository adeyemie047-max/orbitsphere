import Link from "next/link";
import Image from "next/image";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { CategoryBadge } from "@/components/ui/Badge";

interface HeroProps {
  featured: PublicArticle;
  subArticles: PublicArticle[];
}

export default function Hero({ featured, subArticles }: HeroProps) {
  return (
    <section className="bg-[var(--ds-hero-bg)] pb-8 sm:pb-10">
      <div className="container-main pt-6 sm:pt-8">
        <div className="column-rule mb-5 sm:mb-6 text-center border-b border-[var(--ds-hero-border)]">
          <p className="font-ui text-[10px] font-bold tracking-[0.22em] uppercase text-[var(--ds-hero-subtle)]">
            Front Page
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 sm:gap-6 fade-up">
          <Link href={`/article/${featured.slug}`} className="group xl:row-span-2">
            <div className="relative overflow-hidden bg-black h-[280px] sm:h-[400px] xl:h-[520px]">
              {featured.featuredImage && (
                <Image
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority
                  sizes="(max-width: 1280px) 100vw, 70vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              <div className="absolute top-4 left-4 font-ui text-[10px] tracking-widest uppercase text-white bg-[var(--ds-accent)] px-2.5 py-1">
                Lead Story
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-7 z-10">
                <CategoryBadge category={featured.category} breaking={featured.isBreaking} />
                <h1 className="font-serif text-[22px] sm:text-[26px] xl:text-[36px] font-black leading-[1.15] text-white my-2 sm:my-3 tracking-tight group-hover:underline decoration-2 underline-offset-4">
                  {featured.title}
                </h1>
                <p className="text-[15px] text-[var(--ds-hero-muted)] leading-[1.65] mb-4 max-w-xl line-clamp-2 font-serif">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 flex-wrap border-t border-[var(--ds-hero-border)] pt-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={featured.author.initials} />
                    <span className="font-ui text-[12px] text-[var(--ds-hero-muted)]">
                      {featured.author.name}
                    </span>
                  </div>
                  <span className="font-ui text-[11px] text-[var(--ds-hero-subtle)]">
                    {formatRelativeTime(featured.publishedAt)} · {featured.readTime ?? 5} min
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-col bg-[var(--ds-hero-panel)] border border-[var(--ds-hero-border)] divide-y divide-[var(--ds-hero-border)] fade-up-2">
            {subArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] bg-transparent hover:bg-[var(--ds-hero-panel)] transition-colors min-h-[120px] sm:min-h-[130px]"
              >
                {article.featuredImage ? (
                  <div className="relative h-full border-r border-[var(--ds-hero-border)]">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  </div>
                ) : (
                  <div className="bg-[var(--ds-hero-panel)] border-r border-[var(--ds-hero-border)] flex items-center justify-center font-ui text-[9px] text-[var(--ds-hero-subtle)] tracking-widest uppercase">
                    Photo
                  </div>
                )}
                <div className="p-3 sm:p-3.5 flex flex-col justify-center gap-1">
                  <CategoryBadge category={article.category} />
                  <div className="font-serif text-[14px] font-bold leading-[1.35] text-[var(--ds-hero-fg)] group-hover:text-[var(--ds-accent-light)] line-clamp-3">
                    {article.title}
                  </div>
                  <div className="font-ui text-[10px] text-[var(--ds-accent-light)] uppercase tracking-wide font-semibold">
                    {formatRelativeTime(article.publishedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

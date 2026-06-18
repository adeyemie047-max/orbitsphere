"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import { formatViews } from "@/lib/utils";
import RelativeTime from "@/components/ui/RelativeTime";

interface TrendingCarouselClientProps {
  articles: PublicArticle[];
}

export default function TrendingCarouselClient({ articles }: TrendingCarouselClientProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track?.children[index]) return;
    const child = track.children[index] as HTMLElement;
    track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (paused || articles.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % articles.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);
    return () => window.clearInterval(timer);
  }, [articles.length, paused, scrollToIndex]);

  return (
    <>
      <div className="flex items-center gap-2 mb-4 sm:hidden">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollToIndex((activeIndex - 1 + articles.length) % articles.length)}
          className="w-8 h-8 rounded-full border border-border text-text-muted bg-surface text-sm"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollToIndex((activeIndex + 1) % articles.length)}
          className="w-8 h-8 rounded-full border border-border text-text-muted bg-surface text-sm"
        >
          →
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group snap-start shrink-0 w-[85vw] max-w-[280px] sm:w-[240px] editorial-card overflow-hidden flex flex-col"
          >
            {article.featuredImage && (
              <div className="relative h-28 sm:h-32 overflow-hidden shrink-0">
                <EditorialImage
                  src={article.featuredImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <span className="absolute top-2 left-2 font-ui text-[10px] font-bold text-white bg-[var(--ds-accent)] px-1.5 py-0.5 rounded">
                  {index + 1}
                </span>
              </div>
            )}
            <div className="p-4 flex flex-col flex-1 min-w-0">
              <span className="font-ui text-[10px] font-semibold text-[var(--ds-accent)] uppercase tracking-wide mb-1.5">
                {article.category.name}
              </span>
              <h3 className="font-serif text-[15px] font-bold leading-snug text-text-primary mb-2 hover-accent-title line-clamp-3">
                {article.title}
              </h3>
              <p className="font-ui text-[11px] text-text-muted mt-auto">
                {formatViews(article.viewsCount)}
                {article.publishedAt ? (
                  <>
                    {" · "}
                    <RelativeTime dateStr={article.publishedAt} />
                  </>
                ) : null}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

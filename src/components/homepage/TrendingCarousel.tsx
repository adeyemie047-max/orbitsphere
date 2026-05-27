"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime, formatViews } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface TrendingCarouselProps {
  articles: PublicArticle[];
}

export default function TrendingCarousel({ articles }: TrendingCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track || !track.children[index]) return;
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
    }, 5000);

    return () => window.clearInterval(timer);
  }, [articles.length, paused, scrollToIndex]);

  return (
    <section className="py-[70px]">
      <div className="container-main">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="gold-rule" />
            <h2 className="section-title">Trending Now</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous trending story"
              onClick={() =>
                scrollToIndex((activeIndex - 1 + articles.length) % articles.length)
              }
              className="w-9 h-9 rounded-full border border-white/10 text-text-secondary hover:border-gold hover:text-gold transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next trending story"
              onClick={() => scrollToIndex((activeIndex + 1) % articles.length)}
              className="w-9 h-9 rounded-full border border-white/10 text-text-secondary hover:border-gold hover:text-gold transition-colors"
            >
              →
            </button>
            <Button href="/trending" variant="outline" size="sm">
              View All →
            </Button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group relative shrink-0 w-[min(100%,280px)] sm:w-[240px] snap-start bg-surface border border-white/6 rounded-[14px] p-5 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-[rgba(212,175,55,0.25)]"
            >
              <span className="absolute -top-1.5 right-4 font-serif text-[72px] font-black text-[rgba(212,175,55,0.07)] leading-none pointer-events-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="font-ui text-[11px] font-bold text-gold mb-3 tracking-wide">
                {String(index + 1).padStart(2, "0")} · {article.category.name}
              </div>
              <div className="font-serif text-[15px] font-bold leading-[1.45] text-text-primary mb-3 transition-colors group-hover:text-gold line-clamp-3">
                {article.title}
              </div>
              <div className="font-ui text-[11px] text-text-muted">
                {formatViews(article.viewsCount)}
                {article.publishedAt
                  ? ` · ${formatRelativeTime(article.publishedAt)}`
                  : ""}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

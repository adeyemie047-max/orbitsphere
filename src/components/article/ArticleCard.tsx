import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { CategoryBadge } from "@/components/ui/Badge";

type CardArticle = PublicArticle | Article;

interface ArticleCardProps {
  article: CardArticle;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group block h-full min-w-0 focus-visible:outline-none">
      <article className="editorial-card h-full flex flex-col overflow-hidden min-w-0">
        {article.featuredImage ? (
          <div className="relative aspect-[16/10] overflow-hidden shrink-0 card-image-shine">
            <EditorialImage
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes={featured ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 768px) 100vw, 33vw"}
            />
          </div>
        ) : (
          <div className="aspect-[16/10] bg-[var(--ds-surface-2)] shrink-0" />
        )}
        <div className={`flex flex-col flex-1 min-w-0 ${featured ? "p-6 sm:p-8" : "p-5 sm:p-6"}`}>
          <CategoryBadge
            category={article.category}
            breaking={article.isBreaking}
            className="mb-3 w-fit"
          />
          <h3
            className={`font-serif leading-snug text-[var(--ds-ink)] mb-2 line-clamp-3 story-link-hover pb-0.5 ${
              featured ? "text-2xl sm:text-3xl tracking-[-0.025em]" : "text-lg sm:text-xl tracking-[-0.02em]"
            }`}
          >
            {article.title}
          </h3>
          <p className="text-[14px] text-[var(--ds-text-secondary)] leading-relaxed line-clamp-2 mb-4 flex-1">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-[var(--ds-border-subtle)] mt-auto min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar initials={article.author.initials} size="sm" />
              <span className="font-ui text-xs text-[var(--ds-text-secondary)] truncate">
                {article.author.name}
              </span>
            </div>
            <span className="font-ui text-[11px] text-[var(--ds-text-muted)] shrink-0">
              {formatRelativeTime(article.publishedAt)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

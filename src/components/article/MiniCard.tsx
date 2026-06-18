import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { CategoryBadge } from "@/components/ui/Badge";

type CardArticle = PublicArticle | Article;

interface MiniCardProps {
  article: CardArticle;
  showCategory?: boolean;
}

export default function MiniCard({ article, showCategory = true }: MiniCardProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-3.5 py-4 border-b border-[var(--ds-border)] last:border-b-0 min-w-0 hover:opacity-90 transition-opacity"
    >
      {article.featuredImage ? (
        <div className="relative w-[72px] h-[72px] shrink-0 rounded-[var(--radius-sm)] overflow-hidden bg-[var(--ds-surface-2)]">
          <EditorialImage
            src={article.featuredImage}
            alt=""
            fill
            className="object-cover"
            sizes="72px"
          />
        </div>
      ) : (
        <div className="w-[72px] h-[72px] shrink-0 rounded-[var(--radius-sm)] bg-[var(--ds-surface-2)]" />
      )}
      <div className="min-w-0 flex-1">
        {showCategory && <CategoryBadge category={article.category} className="mb-2" />}
        <p className="font-serif text-[15px] leading-snug text-[var(--ds-ink)] mb-1.5 line-clamp-3 group-hover:opacity-85 transition-opacity">
          {article.title}
        </p>
        <p className="font-ui text-[11px] text-[var(--ds-text-muted)]">
          {formatRelativeTime(article.publishedAt)} · {article.readTime ?? 5} min
        </p>
      </div>
    </Link>
  );
}

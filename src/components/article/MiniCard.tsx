import Link from "next/link";
import Image from "next/image";
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
      className="group grid grid-cols-[72px_1fr] sm:grid-cols-[90px_1fr] gap-3 sm:gap-3.5 py-3 sm:py-3.5 border-b border-border last:border-b-0 hover:pl-1.5 transition-all"
    >
      {article.featuredImage ? (
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="90px"
          />
        </div>
      ) : (
        <div className="aspect-square rounded-lg bg-surface-2 flex items-center justify-center font-[family-name:var(--font-ui)] text-[9px] text-text-muted">
          Img
        </div>
      )}
      <div>
        {showCategory && (
          <CategoryBadge category={article.category} className="mb-1.5" />
        )}
        <div className="font-[family-name:var(--font-serif)] text-sm font-bold leading-[1.4] text-text-primary mb-1.5 transition-colors group-hover:text-gold line-clamp-2">
          {article.title}
        </div>
        <div className="font-[family-name:var(--font-ui)] text-[11px] text-text-muted">
          {formatRelativeTime(article.publishedAt)} · {article.readTime ?? 5} min
        </div>
      </div>
    </Link>
  );
}

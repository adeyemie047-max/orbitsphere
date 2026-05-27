import Link from "next/link";
import Image from "next/image";
import type { PublicArticle } from "@/lib/articles-db";
import type { Article } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { CategoryBadge } from "@/components/ui/Badge";

type CardArticle = PublicArticle | Article;

interface ArticleCardProps {
  article: CardArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <article className="bg-surface border border-border overflow-hidden transition-all hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5">
        {article.featuredImage ? (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-350 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-midnight-mid to-surface-2 flex items-center justify-center font-[family-name:var(--font-ui)] text-[11px] text-text-muted tracking-widest uppercase">
            Image
          </div>
        )}
        <div className="p-5">
          <CategoryBadge
            category={article.category}
            breaking={article.isBreaking}
            className="mb-2"
          />
          <div className="flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-[11px] text-text-muted my-2.5">
            <span>{article.author.name}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
            <span>{formatRelativeTime(article.publishedAt)}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
            <span>{article.readTime ?? 5} min</span>
          </div>
          <h3 className="font-[family-name:var(--font-serif)] text-[17px] font-bold leading-[1.45] text-text-primary mb-2.5 transition-colors group-hover:text-gold">
            {article.title}
          </h3>
          <p className="text-[13px] text-text-secondary leading-[1.65] mb-3.5 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2.5">
            <Avatar initials={article.author.initials} />
            <span className="font-[family-name:var(--font-ui)] text-xs text-text-secondary">
              {article.author.name} · {article.author.role}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

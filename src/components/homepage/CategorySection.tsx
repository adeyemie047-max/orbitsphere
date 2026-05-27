import Link from "next/link";
import Image from "next/image";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";
import MiniCard from "@/components/article/MiniCard";
import Button from "@/components/ui/Button";
import { CategoryBadge } from "@/components/ui/Badge";

interface CategorySectionProps {
  category: PublicArticle["category"];
  featured: PublicArticle;
  articles: PublicArticle[];
}

export default function CategorySection({
  category,
  featured,
  articles,
}: CategorySectionProps) {
  return (
    <section className="py-[60px] border-t border-white/6">
      <div className="container-main">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="gold-rule" />
            <h2 className="section-title">{category.name}</h2>
          </div>
          <Button href={`/${category.slug}`} variant="outline" size="sm">
            All {category.name} →
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link href={`/article/${featured.slug}`} className="group">
            <div className="grid grid-cols-1 md:grid-cols-2 bg-surface border border-white/6 rounded-[14px] overflow-hidden hover:border-[rgba(212,175,55,0.25)] transition-all">
              {featured.featuredImage ? (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={featured.featuredImage}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-[#0d2040] to-[#1e3a55] flex items-center justify-center font-[family-name:var(--font-ui)] text-[10px] text-text-muted tracking-widest uppercase">
                  Image
                </div>
              )}
              <div className="p-8 flex flex-col justify-center gap-3">
                <CategoryBadge category={category} breaking={featured.isBreaking} />
                <h3 className="font-[family-name:var(--font-serif)] text-[26px] font-black leading-[1.3] text-text-primary transition-colors group-hover:text-gold">
                  {featured.title}
                </h3>
                <p className="text-sm text-text-secondary leading-[1.7] line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-2.5 font-[family-name:var(--font-ui)] text-[11px] text-text-muted">
                  <span>{formatRelativeTime(featured.publishedAt)}</span>
                  <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
                  <span>{featured.readTime ?? 5} min read</span>
                </div>
                <span className="inline-flex mt-2 font-[family-name:var(--font-ui)] text-xs font-semibold text-gold">
                  Read More →
                </span>
              </div>
            </div>
          </Link>
          <div>
            {articles.map((article) => (
              <MiniCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

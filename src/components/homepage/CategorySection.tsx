import Link from "next/link";
import EditorialImage from "@/components/ui/EditorialImage";
import type { PublicArticle } from "@/lib/articles-db";
import { formatRelativeTime } from "@/lib/utils";
import MiniCard from "@/components/article/MiniCard";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  category: PublicArticle["category"];
  featured: PublicArticle;
  articles: PublicArticle[];
  alternate?: boolean;
}

export default function CategorySection({
  category,
  featured,
  articles,
  alternate = false,
}: CategorySectionProps) {
  return (
    <section
      className={cn(
        "section-block border-b border-[var(--ds-border)] reveal-on-scroll",
        alternate ? "reveal-delay-3" : "reveal-delay-2"
      )}
    >
      <div className="container-main pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="section-label-row flex-1">
            <h2 className="section-label">{category.name}</h2>
          </div>
          <Button href={`/${category.slug}`} variant="outline" size="sm" className="rounded-[2px] shrink-0">
            View all
          </Button>
        </div>
        <div className="editorial-grid editorial-grid--interactive editorial-grid--lift reveal-stagger grid-cols-1 lg:grid-cols-2">
          <Link href={`/article/${featured.slug}`} className="group block min-w-0 border-b lg:border-b-0 lg:border-r border-[var(--ds-border)]">
            <article className="overflow-hidden h-full flex flex-col bg-[var(--ds-surface)]">
              {featured.featuredImage && (
                <div className="relative aspect-[16/10] overflow-hidden card-image-shine">
                  <EditorialImage
                    src={featured.featuredImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="p-5 sm:p-6 flex flex-col flex-1 min-w-0 group-hover:bg-[rgba(10,10,10,0.03)] transition-colors">
                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--ds-text-muted)] mb-3">
                  {category.name}
                </p>
                <h3 className="font-serif text-xl sm:text-2xl leading-tight text-[var(--ds-ink)] mb-2 line-clamp-3 story-link-hover pb-0.5">
                  {featured.title}
                </h3>
                <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed line-clamp-2 mb-4 flex-1">
                  {featured.excerpt}
                </p>
                <p className="font-ui text-[11px] text-[var(--ds-text-muted)]">
                  {formatRelativeTime(featured.publishedAt)} · {featured.readTime ?? 5} min
                </p>
              </div>
            </article>
          </Link>
          <div className="min-w-0 bg-[var(--ds-surface)]">
            {articles.map((article, index) => (
              <div key={article.id} className={index > 0 ? "border-t border-[var(--ds-border)]" : ""}>
                <MiniCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

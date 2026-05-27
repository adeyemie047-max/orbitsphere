import Link from "next/link";
import Image from "next/image";
import type { ArticleDetail, PublicArticle } from "@/lib/articles-db";
import {
  AI_SUMMARY_DISCLAIMER,
  AI_SUMMARY_LABEL,
} from "@/lib/ai-summary";
import {
  formatDate,
  formatRelativeTime,
  formatViews,
} from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { CategoryBadge } from "@/components/ui/Badge";
import MiniCard from "@/components/article/MiniCard";
import ArticleCard from "@/components/article/ArticleCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import ShareButtons from "@/components/article/ShareButtons";
import ReadAloud from "@/components/article/ReadAloud";
import CommentsSection from "@/components/article/CommentsSection";
import ArticleFeedback from "@/components/article/ArticleFeedback";
import LiveBlogLayout from "@/components/article/LiveBlogLayout";
import BookmarkButton from "@/components/reader/BookmarkButton";
import PollWidget from "@/components/reader/PollWidget";
import { sanitizeHtml } from "@/lib/sanitize-html";

interface ArticleContentProps {
  article: ArticleDetail;
  related: PublicArticle[];
  mostRead: PublicArticle[];
}

export default function ArticleContent({
  article,
  related,
  mostRead,
}: ArticleContentProps) {
  return (
    <div className="container-main py-8 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8 lg:gap-12">
        <article className="fade-up min-w-0">
          <nav className="flex gap-2 items-center mb-5" aria-label="Breadcrumb">
            <Link
              href="/"
              className="font-ui text-xs text-text-muted hover:text-gold"
            >
              Home
            </Link>
            <span className="text-text-muted text-xs">›</span>
            <Link
              href={`/${article.category.slug}`}
              className="font-ui text-xs text-gold hover:underline"
            >
              {article.category.name}
            </Link>
            <span className="text-text-muted text-xs">›</span>
            <span className="font-ui text-xs text-text-muted line-clamp-1">
              {article.title}
            </span>
          </nav>

          <CategoryBadge
            category={article.category}
            breaking={article.isBreaking}
            linked
            className="mb-3.5"
          />

          <h1 className="font-serif text-[26px] sm:text-[32px] md:text-[44px] font-black leading-[1.16] text-foreground mb-5 tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 sm:gap-5 py-4 sm:py-[18px] border-y border-border mb-6 sm:mb-7 flex-wrap">
            <div className="flex items-center gap-3">
              <Avatar initials={article.author.initials} size="md" />
              <div>
                <div className="font-ui text-sm font-semibold text-text-primary">
                  {article.author.name}
                </div>
                <div className="font-ui text-[11px] text-text-muted">
                  {article.author.role} · {article.author.articleCount} articles
                </div>
              </div>
            </div>
            {article.publishedAt && (
              <div className="font-ui text-xs text-text-muted flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  className="w-3.5 h-3.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Published {formatDate(article.publishedAt)}
              </div>
            )}
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <div className="font-ui text-xs text-text-muted">
                Updated {formatRelativeTime(article.updatedAt)}
              </div>
            )}
            <div className="font-ui text-xs text-text-muted flex items-center gap-1.5">
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                className="w-3.5 h-3.5"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {formatViews(article.viewsCount)}
            </div>
            <div className="font-ui text-xs text-text-muted">
              📖 {article.readTime ?? 5} min read
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ShareButtons title={article.title} slug={article.slug} />
            <BookmarkButton articleId={article.id} />
          </div>

          {"isLiveBlog" in article && article.isLiveBlog && (
            <LiveBlogLayout slug={article.slug} title={article.title} />
          )}

          {article.featuredImage && (
            <>
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-lg sm:rounded-[14px] overflow-hidden mb-2">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 900px"
                />
              </div>
              {article.imageCaption && (
                <p className="font-ui text-xs text-text-muted italic mb-8">
                  {article.imageCaption}
                </p>
              )}
            </>
          )}

          <ReadAloud
            title={article.title}
            excerpt={article.excerpt}
            body={article.body}
            readTime={article.readTime}
          />

          {article.aiSummary.length > 0 && (
            <div
              className="bg-surface-2 border border-border rounded-lg sm:rounded-[14px] p-4 sm:p-6 mb-6 sm:mb-8"
              role="note"
              aria-label={AI_SUMMARY_LABEL}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(230,46,45,0.1)] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="var(--color-electric)"
                    fill="none"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <span className="font-ui text-xs font-bold text-[var(--ds-accent)] tracking-widest uppercase">
                    {AI_SUMMARY_LABEL} · Read in 30 seconds
                  </span>
                  <p className="font-ui text-[10px] text-text-muted mt-0.5">
                    {AI_SUMMARY_DISCLAIMER}
                  </p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5 list-none mt-4">
                {article.aiSummary.map((point, index) => (
                  <li
                    key={index}
                    className="text-sm text-text-secondary leading-[1.6] flex gap-3 items-start"
                  >
                    <span className="text-[var(--ds-accent)] font-semibold shrink-0">→</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.body && (
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }}
            />
          )}

          <div className="flex flex-wrap gap-2 my-5">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="font-ui text-[11px] font-medium px-3.5 py-1.5 rounded-full bg-surface-2 border border-border text-text-secondary hover:bg-[rgba(230,46,45,0.08)] hover:border-[var(--ds-accent)] hover:text-[var(--ds-accent)] transition-all tracking-wide"
              >
                {tag}
              </Link>
            ))}
          </div>

          <ArticleFeedback />

          <CommentsSection
            articleSlug={article.slug}
            initialComments={article.comments}
          />
        </article>

        <aside className="min-w-0">
          <div className="bg-surface border border-border rounded-lg sm:rounded-[14px] p-5 sm:p-6 mb-6 xl:sticky xl:top-24">
            <h3 className="font-serif text-lg font-bold text-foreground mb-5 pb-3 border-b border-border">
              Most Read Today
            </h3>
            {mostRead.map((item) => (
              <MiniCard key={item.id} article={item} showCategory={false} />
            ))}
          </div>

          <PollWidget articleSlug={article.slug} />

          <div className="bg-surface-2 border border-border rounded-lg sm:rounded-[14px] p-5 sm:p-6">
            <h3 className="font-serif text-lg font-bold text-[var(--ds-accent)] mb-4">
              Newsletter
            </h3>
            <p className="text-[13px] text-text-secondary leading-[1.6] mb-4">
              Get OrbitSphere&apos;s morning brief delivered to your inbox.
            </p>
            <NewsletterForm compact />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-border">
          <div className="gold-rule" />
          <h2 className="section-title mb-8">Related Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

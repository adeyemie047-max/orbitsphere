import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleContent from "@/components/article/ArticleContent";
import ViewCounter from "@/components/article/ViewCounter";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  newsArticleJsonLd,
} from "@/lib/json-ld";
import {
  getAllArticleSlugs,
  getCachedArticlePageData,
} from "@/lib/article-page-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbitsphere.com";

/** PRD §8.3 — article pages with ISR. */
export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedArticlePageData(slug);
  if (!data) return { title: "Article Not Found" };

  const { article } = data;
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      authors: [article.author.name],
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const data = await getCachedArticlePageData(slug);
  if (!data) notFound();

  const { article, related, mostRead } = data;

  return (
    <>
      <ViewCounter slug={slug} />
      <JsonLd
        data={[
          newsArticleJsonLd(article),
          breadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            {
              name: article.category.name,
              url: `${SITE_URL}/${article.category.slug}`,
            },
            {
              name: article.title,
              url: `${SITE_URL}/article/${article.slug}`,
            },
          ]),
        ]}
      />
      <ArticleContent
        article={article}
        related={related}
        mostRead={mostRead}
      />
    </>
  );
}

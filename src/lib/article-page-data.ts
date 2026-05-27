import { unstable_cache } from "next/cache";
import {
  getArticleBySlug,
  getRelatedArticles as getMockRelated,
  getTrendingArticles,
  articles as mockArticles,
} from "@/lib/data";
import type { Article } from "@/lib/types";
import { deriveAiSummary } from "@/lib/ai-summary";
import {
  MOCK_AI,
  MOCK_CAPTIONS,
  mockToPublicFromArticle,
} from "@/lib/category-page-data";
import {
  getArticleComments,
  getPublicArticles,
  getRelatedArticles,
  serializeArticle,
  type ArticleDetail,
  type PublicArticle,
} from "@/lib/articles-db";
import { db } from "@/lib/db";
import { ArticleStatus } from "@prisma/client";

function mockComments(article: Article): ArticleDetail["comments"] {
  return (article.comments ?? []).map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    author: { name: c.author, initials: c.initials },
    replies: [],
  }));
}

function buildMockArticleDetail(slug: string): ArticleDetail | null {
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") return null;

  const base = mockToPublicFromArticle(article);

  return {
    ...base,
    updatedAt: article.publishedAt,
    imageCaption: article.imageCaption ?? null,
    aiSummary: MOCK_AI[slug] ?? deriveAiSummary(article.excerpt, article.body),
    author: {
      ...base.author,
      articleCount: article.author.articleCount ?? 0,
    },
    comments: mockComments(article),
  };
}

export type ArticlePageData = {
  source: "database" | "mock";
  article: ArticleDetail;
  related: PublicArticle[];
  mostRead: PublicArticle[];
};

async function fetchArticlePage(slug: string): Promise<ArticlePageData | null> {
  const record = await db.article.findFirst({
    where: { slug, status: ArticleStatus.published },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          username: true,
          role: true,
          avatarUrl: true,
          _count: { select: { articles: true } },
        },
      },
      category: true,
      articleTags: { include: { tag: true } },
    },
  });

  if (!record) return null;

  const base = serializeArticle(
    record as Parameters<typeof serializeArticle>[0]
  );
  const [comments, related, mostRead] = await Promise.all([
    getArticleComments(record.id),
    getRelatedArticles(record.category.slug, slug, 4),
    getPublicArticles({ trending: true, limit: 3 }),
  ]);

  const article: ArticleDetail = {
    ...base,
    updatedAt: record.updatedAt.toISOString(),
    imageCaption: MOCK_CAPTIONS[slug] ?? null,
    aiSummary: MOCK_AI[slug] ?? deriveAiSummary(record.excerpt, record.body),
    author: {
      ...base.author,
      articleCount: record.author._count.articles,
    },
    comments,
  };

  return { source: "database", article, related, mostRead };
}

function buildMockArticlePage(slug: string): ArticlePageData | null {
  const article = buildMockArticleDetail(slug);
  if (!article) return null;

  const mockArticle = getArticleBySlug(slug)!;
  return {
    source: "mock",
    article,
    related: getMockRelated(mockArticle, 4).map((a) =>
      mockToPublicFromArticle(a)
    ),
    mostRead: getTrendingArticles(3).map((a) => mockToPublicFromArticle(a)),
  };
}

export async function getArticlePageData(
  slug: string
): Promise<ArticlePageData | null> {
  try {
    return (await fetchArticlePage(slug)) ?? buildMockArticlePage(slug);
  } catch {
    return buildMockArticlePage(slug);
  }
}

export const getCachedArticlePageData = (slug: string) =>
  unstable_cache(
    () => getArticlePageData(slug),
    [`article-page-${slug}`],
    { revalidate: 60, tags: ["articles", `article-${slug}`] }
  )();

export function getAllArticleSlugs(): string[] {
  return mockArticles.map((a) => a.slug);
}

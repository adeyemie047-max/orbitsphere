import { db } from "@/lib/db";
import {
  articleInclude,
  getPublicArticles,
  serializeArticle,
} from "@/lib/articles-db";
import { getBookmarkArticleIds } from "@/lib/bookmarks";
import { ArticleStatus } from "@prisma/client";

export async function getPersonalizedFeed(userId: string, limit = 20) {
  const [follows, bookmarkIds] = await Promise.all([
    db.userCategoryFollow.findMany({
      where: { userId },
      select: { categoryId: true },
    }),
    getBookmarkArticleIds(userId),
  ]);

  const categoryIds = follows.map((f) => f.categoryId);

  if (categoryIds.length === 0) {
    return getPublicArticles({ limit, trending: true });
  }

  const articles = await db.article.findMany({
    where: {
      status: ArticleStatus.published,
      categoryId: { in: categoryIds },
    },
    include: articleInclude,
    orderBy: [{ publishedAt: "desc" }],
    take: limit * 2,
  });

  const scored = articles.map((article) => {
    let score = 0;
    if (bookmarkIds.includes(article.id)) score += 10;
    if (article.isFeatured) score += 5;
    if (article.isBreaking) score += 3;
    score += Math.min(article.viewsCount / 1000, 5);
    const ageHours =
      (Date.now() - (article.publishedAt?.getTime() ?? Date.now())) /
      (1000 * 60 * 60);
    score += Math.max(0, 10 - ageHours / 24);
    return { article, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => serializeArticle(article));
}

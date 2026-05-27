import { db } from "@/lib/db";
import { articleInclude, serializeArticle } from "@/lib/articles-db";
import { ArticleStatus } from "@prisma/client";

export async function listBookmarks(userId: string) {
  const bookmarks = await db.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      article: { include: articleInclude },
    },
  });

  return bookmarks
    .filter((b) => b.article.status === ArticleStatus.published)
    .map((b) => ({
      id: b.id,
      savedAt: b.createdAt.toISOString(),
      article: serializeArticle(b.article),
    }));
}

export async function addBookmark(userId: string, articleId: string) {
  const article = await db.article.findFirst({
    where: { id: articleId, status: ArticleStatus.published },
  });
  if (!article) return null;

  return db.bookmark.upsert({
    where: { userId_articleId: { userId, articleId } },
    create: { userId, articleId },
    update: {},
  });
}

export async function removeBookmark(userId: string, articleId: string) {
  await db.bookmark.deleteMany({ where: { userId, articleId } });
}

export async function isBookmarked(userId: string, articleId: string) {
  const row = await db.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  return !!row;
}

export async function getBookmarkArticleIds(userId: string) {
  const rows = await db.bookmark.findMany({
    where: { userId },
    select: { articleId: true },
  });
  return rows.map((r) => r.articleId);
}

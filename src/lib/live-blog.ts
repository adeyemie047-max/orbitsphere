import { db } from "@/lib/db";

export async function getLiveBlogEntries(articleSlug: string) {
  const article = await db.article.findFirst({
    where: { slug: articleSlug, isLiveBlog: true, status: "published" },
    select: { id: true, title: true, slug: true },
  });
  if (!article) return null;

  const entries = await db.liveBlogEntry.findMany({
    where: { articleId: article.id },
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    include: {
      author: { select: { fullName: true, avatarUrl: true } },
    },
  });

  return {
    article: { id: article.id, title: article.title, slug: article.slug },
    entries: entries.map((e) => ({
      id: e.id,
      body: e.body,
      isPinned: e.isPinned,
      publishedAt: e.publishedAt.toISOString(),
      author: {
        name: e.author.fullName ?? "Editor",
        avatarUrl: e.author.avatarUrl,
      },
    })),
  };
}

export async function isLiveBlogArticle(slug: string) {
  const article = await db.article.findFirst({
    where: { slug, isLiveBlog: true, status: "published" },
    select: { id: true },
  });
  return !!article;
}

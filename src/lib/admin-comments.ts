import { db } from "@/lib/db";

export async function listPendingComments(options: {
  page: number;
  limit: number;
}) {
  const where = { isApproved: false };

  const [comments, total] = await Promise.all([
    db.comment.findMany({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        article: { select: { id: true, title: true, slug: true } },
      },
    }),
    db.comment.count({ where }),
  ]);

  return {
    data: comments.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
      parentId: c.parentId,
      author: {
        id: c.user.id,
        name: c.user.fullName ?? c.user.email,
        email: c.user.email,
      },
      article: {
        id: c.article.id,
        title: c.article.title,
        slug: c.article.slug,
      },
    })),
    total,
    page: options.page,
    limit: options.limit,
  };
}

export async function approveComment(id: string) {
  const comment = await db.comment.update({
    where: { id },
    data: { isApproved: true },
    include: {
      article: { select: { slug: true } },
    },
  });

  return comment;
}

export async function deleteComment(id: string) {
  await db.comment.delete({ where: { id } });
}

export async function getCommentById(id: string) {
  return db.comment.findUnique({ where: { id } });
}

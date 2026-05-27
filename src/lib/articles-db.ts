import { ArticleStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export const articleInclude = {
  author: {
    select: {
      id: true,
      fullName: true,
      username: true,
      role: true,
      avatarUrl: true,
    },
  },
  category: true,
  articleTags: {
    include: { tag: true },
  },
} satisfies Prisma.ArticleInclude;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

const publicArticleWhere: Prisma.ArticleWhereInput = {
  status: ArticleStatus.published,
  OR: [{ publishedAt: { lte: new Date() } }, { publishedAt: null }],
};

export function serializeArticle(article: ArticleWithRelations) {
  const initials = (article.author.fullName ?? "??")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    featuredImage: article.featuredImage,
    author: {
      id: article.author.id,
      name: article.author.fullName ?? "Unknown",
      role: article.author.role,
      initials,
    },
    category: {
      id: article.category.id,
      name: article.category.name,
      slug: article.category.slug,
      description: article.category.description,
      color: article.category.color,
    },
    status: article.status,
    isBreaking: article.isBreaking,
    isFeatured: article.isFeatured,
    isInvestigative: article.isInvestigative,
    isLiveBlog: article.isLiveBlog,
    viewsCount: article.viewsCount,
    readTime: article.readTime,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    tags: article.articleTags.map(({ tag }) => tag.name),
  };
}

export async function getPublicArticles(options: {
  limit?: number;
  breaking?: boolean;
  trending?: boolean;
  featured?: boolean;
  categorySlug?: string;
  query?: string;
}) {
  const { limit = 20, breaking, trending, featured, categorySlug, query } =
    options;

  const where: Prisma.ArticleWhereInput = {
    ...publicArticleWhere,
    ...(breaking ? { isBreaking: true } : {}),
    ...(featured ? { isFeatured: true } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            {
              articleTags: {
                some: {
                  tag: { name: { contains: query, mode: "insensitive" } },
                },
              },
            },
            {
              author: {
                fullName: { contains: query, mode: "insensitive" },
              },
            },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ArticleOrderByWithRelationInput[] = trending
    ? [{ viewsCount: "desc" }, { publishedAt: "desc" }]
    : [{ publishedAt: "desc" }];

  const articles = await db.article.findMany({
    where,
    include: articleInclude,
    orderBy,
    take: limit,
  });

  return articles.map(serializeArticle);
}

export async function getPublicArticleBySlug(slug: string) {
  const article = await db.article.findFirst({
    where: { slug, ...publicArticleWhere },
    include: articleInclude,
  });

  return article ? serializeArticle(article) : null;
}

export type PublicArticle = ReturnType<typeof serializeArticle>;

export type BreakingHeadlineItem = {
  id: string;
  text: string;
  slug: string;
};

export async function getBreakingHeadlines(
  limit = 8
): Promise<BreakingHeadlineItem[]> {
  const articles = await getPublicArticles({ breaking: true, limit });
  return articles.map((article) => ({
    id: article.id,
    text: article.title.toUpperCase(),
    slug: article.slug,
  }));
}

export async function getActiveAdvertisements(
  placement?: "banner" | "sidebar" | "inline" | "footer"
) {
  const now = new Date();

  return db.advertisement.findMany({
    where: {
      isActive: true,
      ...(placement ? { placement } : {}),
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { startsAt: "desc" },
  });
}

export async function getPublicCategories() {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublicCategoryBySlug(slug: string) {
  return db.category.findUnique({ where: { slug } });
}

export type SerializedComment = {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string; initials: string };
  replies: SerializedComment[];
};

export type ArticleDetail = PublicArticle & {
  updatedAt: string | null;
  imageCaption: string | null;
  aiSummary: string[];
  author: PublicArticle["author"] & { articleCount: number };
  comments: SerializedComment[];
};

function serializeComment(
  comment: {
    id: string;
    body: string | null;
    createdAt: Date;
    user: { fullName: string | null };
    replies?: Array<{
      id: string;
      body: string | null;
      createdAt: Date;
      user: { fullName: string | null };
    }>;
  }
): SerializedComment {
  const name = comment.user.fullName ?? "Reader";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: comment.id,
    body: comment.body ?? "",
    createdAt: comment.createdAt.toISOString(),
    author: { name, initials },
    replies: (comment.replies ?? []).map((reply) =>
      serializeComment({ ...reply, user: reply.user, replies: [] })
    ),
  };
}

export async function getArticleComments(articleId: string) {
  const comments = await db.comment.findMany({
    where: { articleId, isApproved: true, parentId: null },
    include: {
      user: { select: { fullName: true } },
      replies: {
        where: { isApproved: true },
        include: { user: { select: { fullName: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments.map(serializeComment);
}

export async function getRelatedArticles(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
) {
  const articles = await db.article.findMany({
    where: {
      ...publicArticleWhere,
      slug: { not: excludeSlug },
      category: { slug: categorySlug },
    },
    include: articleInclude,
    orderBy: [{ viewsCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });

  return articles.map(serializeArticle);
}

export async function incrementArticleViews(slug: string) {
  const result = await db.article.updateMany({
    where: { slug, status: ArticleStatus.published },
    data: { viewsCount: { increment: 1 } },
  });

  if (result.count === 0) return null;

  const article = await db.article.findFirst({
    where: { slug },
    select: { viewsCount: true },
  });

  return article?.viewsCount ?? null;
}

export async function getCategoryArticlesPaginated(
  categorySlug: string,
  page: number,
  perPage = 12
) {
  const where: Prisma.ArticleWhereInput = {
    ...publicArticleWhere,
    category: { slug: categorySlug },
  };

  const [total, articles] = await Promise.all([
    db.article.count({ where }),
    db.article.findMany({
      where,
      include: articleInclude,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  return {
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    articles: articles.map(serializeArticle),
  };
}

export async function getPopularTagsForCategory(
  categorySlug: string,
  limit = 8
) {
  const grouped = await db.articleTag.groupBy({
    by: ["tagId"],
    where: {
      article: {
        ...publicArticleWhere,
        category: { slug: categorySlug },
      },
    },
    _count: { tagId: true },
    orderBy: { _count: { tagId: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return [];

  const tags = await db.tag.findMany({
    where: { id: { in: grouped.map((g) => g.tagId) } },
  });

  const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));
  return grouped
    .map((g) => tagById[g.tagId])
    .filter(Boolean)
    .map((tag) => ({ name: tag.name, slug: tag.slug }));
}

export async function getAuthorArticleCount(authorId: string) {
  return db.article.count({
    where: { authorId, ...publicArticleWhere },
  });
}

export async function getAllPublishedSlugs() {
  const articles = await db.article.findMany({
    where: publicArticleWhere,
    select: { slug: true },
  });
  return articles.map((a) => a.slug);
}


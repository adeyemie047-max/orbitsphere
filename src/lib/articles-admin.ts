import { ArticleStatus, UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { canEditArticle } from "@/lib/rbac";
import { estimateReadTime, uniqueArticleSlug } from "@/lib/slug";
import { revalidateArticlePages } from "@/lib/revalidate-articles";
import { notifyBreakingNews } from "@/lib/push";

export type ArticleInput = {
  title: string;
  slug?: string;
  excerpt?: string | null;
  body?: string | null;
  featuredImage?: string | null;
  categoryId: string;
  status?: ArticleStatus;
  scheduledAt?: Date | null;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isInvestigative?: boolean;
  submittedForReview?: boolean;
};

export type EditorArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  featuredImage: string | null;
  categoryId: string;
  categoryName: string;
  status: ArticleStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  isBreaking: boolean;
  isFeatured: boolean;
  isInvestigative: boolean;
  submittedForReview: boolean;
  authorId: string;
  updatedAt: string;
};

export async function getCategoriesForEditor() {
  try {
    return await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, color: true },
    });
  } catch {
    return [];
  }
}

export async function getArticleForEditor(
  id: string,
  role: UserRole,
  userId: string
): Promise<EditorArticle | null> {
  try {
    const article = await db.article.findUnique({
      where: { id },
      include: { category: { select: { name: true } } },
    });

    if (!article) return null;
    if (!canEditArticle(role, userId, article.authorId)) return null;

    return serializeEditorArticle(article);
  } catch {
    return null;
  }
}

function serializeEditorArticle(article: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  featuredImage: string | null;
  categoryId: string;
  category: { name: string };
  status: ArticleStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  isBreaking: boolean;
  isFeatured: boolean;
  isInvestigative: boolean;
  submittedForReview: boolean;
  authorId: string;
  updatedAt: Date;
}): EditorArticle {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    body: article.body,
    featuredImage: article.featuredImage,
    categoryId: article.categoryId,
    categoryName: article.category.name,
    status: article.status,
    scheduledAt: article.scheduledAt?.toISOString() ?? null,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    isBreaking: article.isBreaking,
    isFeatured: article.isFeatured,
    isInvestigative: article.isInvestigative,
    submittedForReview: article.submittedForReview,
    authorId: article.authorId,
    updatedAt: article.updatedAt.toISOString(),
  };
}

function buildPublishFields(
  status: ArticleStatus,
  scheduledAt: Date | null | undefined,
  existingPublishedAt: Date | null
) {
  const now = new Date();

  if (status === ArticleStatus.published) {
    return {
      publishedAt: existingPublishedAt ?? now,
      scheduledAt: null as Date | null,
    };
  }

  if (status === ArticleStatus.scheduled && scheduledAt) {
    return {
      publishedAt: null as Date | null,
      scheduledAt,
    };
  }

  if (status === ArticleStatus.draft || status === ArticleStatus.archived) {
    return {
      publishedAt:
        status === ArticleStatus.archived ? existingPublishedAt : existingPublishedAt,
      scheduledAt: status === ArticleStatus.draft ? null : null,
    };
  }

  return { publishedAt: existingPublishedAt, scheduledAt: scheduledAt ?? null };
}

export async function createArticle(
  input: ArticleInput,
  authorId: string
) {
  const slug = input.slug
    ? input.slug
    : await uniqueArticleSlug(input.title);

  const status = input.status ?? ArticleStatus.draft;
  const readTime = estimateReadTime(input.body ?? "");
  const publishFields = buildPublishFields(status, input.scheduledAt, null);

  const article = await db.article.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt ?? null,
      body: input.body ?? null,
      featuredImage: input.featuredImage ?? null,
      authorId,
      categoryId: input.categoryId,
      status,
      readTime,
      isBreaking: input.isBreaking ?? false,
      isFeatured: input.isFeatured ?? false,
      isInvestigative: input.isInvestigative ?? false,
      submittedForReview: input.submittedForReview ?? false,
      ...publishFields,
    },
    include: {
      category: { select: { slug: true, name: true } },
    },
  });

  if (status === ArticleStatus.published) {
    await revalidateArticlePages(article.slug, article.category.slug);
    if (article.isBreaking) {
      void notifyBreakingNews(article.title, article.slug);
    }
  }

  return serializeEditorArticle(article);
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>,
  role: UserRole,
  userId: string
) {
  const existing = await db.article.findUnique({
    where: { id },
    include: { category: { select: { slug: true, name: true } } },
  });

  if (!existing) return null;
  if (!canEditArticle(role, userId, existing.authorId)) return null;

  const nextStatus = input.status ?? existing.status;
  const body = input.body !== undefined ? input.body : existing.body;
  const publishFields = buildPublishFields(
    nextStatus,
    input.scheduledAt !== undefined ? input.scheduledAt : existing.scheduledAt,
    existing.publishedAt
  );

  let slug = existing.slug;
  if (input.title && input.title !== existing.title && !input.slug) {
    slug = await uniqueArticleSlug(input.title, id);
  } else if (input.slug) {
    slug = input.slug;
  }

  const wasPublished = existing.status === ArticleStatus.published;
  const category = await db.category.findUnique({
    where: { id: input.categoryId ?? existing.categoryId },
    select: { slug: true },
  });

  const article = await db.article.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      slug,
      ...(input.excerpt !== undefined ? { excerpt: input.excerpt } : {}),
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.featuredImage !== undefined
        ? { featuredImage: input.featuredImage }
        : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.isBreaking !== undefined ? { isBreaking: input.isBreaking } : {}),
      ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
      ...(input.isInvestigative !== undefined
        ? { isInvestigative: input.isInvestigative }
        : {}),
      readTime: estimateReadTime(body ?? ""),
      ...publishFields,
    },
    include: { category: { select: { name: true, slug: true } } },
  });

  const isNowPublished = article.status === ArticleStatus.published;
  const categorySlug = category?.slug ?? existing.category.slug;

  if (isNowPublished || wasPublished) {
    await revalidateArticlePages(article.slug, categorySlug);
    if (existing.slug !== article.slug) {
      await revalidateArticlePages(existing.slug, categorySlug);
    }
  }

  if (
    isNowPublished &&
    article.isBreaking &&
    (!wasPublished || (input.isBreaking && !existing.isBreaking))
  ) {
    void notifyBreakingNews(article.title, article.slug);
  }

  return serializeEditorArticle(article);
}

export async function publishScheduledArticles(): Promise<number> {
  const now = new Date();

  const due = await db.article.findMany({
    where: {
      status: ArticleStatus.scheduled,
      scheduledAt: { lte: now },
    },
    include: { category: { select: { slug: true } } },
  });

  for (const article of due) {
    await db.article.update({
      where: { id: article.id },
      data: {
        status: ArticleStatus.published,
        publishedAt: article.scheduledAt ?? now,
        scheduledAt: null,
      },
    });
    await revalidateArticlePages(article.slug, article.category.slug);
    if (article.isBreaking) {
      void notifyBreakingNews(article.title, article.slug);
    }
  }

  return due.length;
}

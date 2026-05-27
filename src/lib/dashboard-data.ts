import { ArticleStatus, UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { articles as mockArticles } from "@/lib/data";

export type DashboardArticleRow = {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  authorName: string;
  categoryName: string;
  categorySlug: string;
  categoryColor: string | null;
  status: ArticleStatus;
  viewsCount: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "gold" | "blue" | "cyan" | "red";
};

export type DashboardAnalytics = {
  stats: DashboardStat[];
  pageviewTrend: number[];
  topArticles: { title: string; slug: string; views: number }[];
  source: "database" | "mock";
};

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function mockDashboardArticles(): DashboardArticleRow[] {
  return mockArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    authorId: a.author.id,
    authorName: a.author.name,
    categoryName: a.category.name,
    categorySlug: a.category.slug,
    categoryColor: a.category.color,
    status: a.status as ArticleStatus,
    viewsCount: a.viewsCount,
    publishedAt: a.publishedAt,
    updatedAt: a.publishedAt,
  }));
}

export async function getDashboardArticles(
  role: UserRole,
  userId: string
): Promise<{ articles: DashboardArticleRow[]; source: "database" | "mock" }> {
  try {
    const records = await db.article.findMany({
      where:
        role === "journalist" ? { authorId: userId } : undefined,
      include: {
        author: { select: { id: true, fullName: true } },
        category: { select: { name: true, slug: true, color: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return {
      source: "database",
      articles: records.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        authorId: r.authorId,
        authorName: r.author.fullName ?? "Unknown",
        categoryName: r.category.name,
        categorySlug: r.category.slug,
        categoryColor: r.category.color,
        status: r.status,
        viewsCount: r.viewsCount,
        publishedAt: r.publishedAt?.toISOString() ?? null,
        updatedAt: r.updatedAt.toISOString(),
      })),
    };
  } catch {
    const articles = mockDashboardArticles();
    return {
      source: "mock",
      articles:
        role === "journalist"
          ? articles.filter((a) => a.authorId === "1" || a.authorId === "2")
          : articles,
    };
  }
}

export async function getDashboardAnalytics(
  role: UserRole
): Promise<DashboardAnalytics> {
  const limited = role === "journalist";

  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      publishedThisMonth,
      publishedToday,
      userCount,
      pendingComments,
      newUsersWeek,
      topArticles,
    ] = await Promise.all([
      db.article.aggregate({ _sum: { viewsCount: true } }),
      db.article.count({
        where: { status: ArticleStatus.published, publishedAt: { gte: monthStart } },
      }),
      db.article.count({
        where: {
          status: ArticleStatus.published,
          publishedAt: { gte: todayStart },
        },
      }),
      limited ? Promise.resolve(0) : db.user.count(),
      db.comment.count({ where: { isApproved: false } }),
      limited ? Promise.resolve(0) : db.user.count({ where: { createdAt: { gte: weekAgo } } }),
      db.article.findMany({
        where: { status: ArticleStatus.published },
        orderBy: { viewsCount: "desc" },
        take: 5,
        select: { title: true, slug: true, viewsCount: true },
      }),
    ]);

    const views = totalViews._sum.viewsCount ?? 0;

    const stats: DashboardStat[] = [
      {
        id: "views",
        label: limited ? "Your article views" : "Total article views",
        value: formatCount(views),
        change: `↑ ${publishedToday} published today`,
        trend: "up",
        icon: "gold",
      },
      ...(limited
        ? []
        : [
            {
              id: "users",
              label: "Registered users",
              value: formatCount(userCount),
              change: `↑ ${newUsersWeek} this week`,
              trend: "up" as const,
              icon: "blue" as const,
            },
          ]),
      {
        id: "articles",
        label: "Published this month",
        value: String(publishedThisMonth),
        change: `↑ ${publishedToday} today`,
        trend: "up",
        icon: "cyan",
      },
      {
        id: "comments",
        label: "Comments pending review",
        value: String(pendingComments),
        change: pendingComments > 0 ? `${pendingComments} awaiting action` : "All clear",
        trend: pendingComments > 0 ? "down" : "up",
        icon: "red",
      },
    ];

    const pageviewTrend = topArticles.length
      ? topArticles.map((a) => Math.max(20, Math.round(a.viewsCount / 500)))
      : [55, 72, 61, 88, 76, 64, 45, 92, 80, 100, 85, 70, 62, 78];

    return {
      stats,
      pageviewTrend,
      topArticles: topArticles.map((a) => ({
        title: a.title,
        slug: a.slug,
        views: a.viewsCount,
      })),
      source: "database",
    };
  } catch {
    return {
      stats: [
        { id: "1", label: "Total article views", value: "482K", change: "↑ mock data", trend: "up", icon: "gold" },
        { id: "2", label: "Registered users", value: "6", change: "↑ seeded users", trend: "up", icon: "blue" },
        { id: "3", label: "Published this month", value: "20", change: "↑ from seed", trend: "up", icon: "cyan" },
        { id: "4", label: "Comments pending", value: "0", change: "All clear", trend: "up", icon: "red" },
      ],
      pageviewTrend: [55, 72, 61, 88, 76, 64, 45, 92, 80, 100, 85, 70, 62, 78],
      topArticles: mockArticles.slice(0, 5).map((a) => ({
        title: a.title,
        slug: a.slug,
        views: a.viewsCount,
      })),
      source: "mock",
    };
  }
}

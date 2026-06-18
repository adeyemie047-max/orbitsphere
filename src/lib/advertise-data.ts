import { db } from "@/lib/db";

export type AdvertiseStats = {
  publishedArticles: number;
  totalViews: number;
  newsletterSubscribers: number;
  monthlyReadersLabel: string;
};

function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K+`;
  return `${value}+`;
}

export async function getAdvertiseStats(): Promise<AdvertiseStats> {
  try {
    const [publishedArticles, viewsAgg, newsletterSubscribers] = await Promise.all([
      db.article.count({
        where: { status: "published" },
      }),
      db.article.aggregate({ _sum: { viewsCount: true } }),
      db.newsletter.count({ where: { isActive: true } }),
    ]);

    const totalViews = viewsAgg._sum.viewsCount ?? 0;

    return {
      publishedArticles,
      totalViews,
      newsletterSubscribers,
      monthlyReadersLabel: formatCount(Math.max(totalViews / 12, publishedArticles * 50)),
    };
  } catch {
    return {
      publishedArticles: 20,
      totalViews: 125_000,
      newsletterSubscribers: 0,
      monthlyReadersLabel: "10K+",
    };
  }
}

export const AD_FORMATS = [
  {
    id: "banner",
    name: "Homepage Leaderboard",
    size: "728 × 90",
    placement: "banner" as const,
    description: "Prime placement below the hero on the homepage — highest visibility.",
    rateFrom: "₦80,000",
    ratePeriod: "/ month",
  },
  {
    id: "sidebar",
    name: "Homepage Rectangle",
    size: "300 × 250",
    placement: "sidebar" as const,
    description: "Mid-page sidebar slot on the homepage, ideal for product launches.",
    rateFrom: "₦50,000",
    ratePeriod: "/ month",
  },
  {
    id: "inline",
    name: "In-Article Banner",
    size: "728 × 90",
    placement: "inline" as const,
    description: "Contextual placement within high-traffic news and business stories.",
    rateFrom: "₦40,000",
    ratePeriod: "/ month",
  },
  {
    id: "newsletter",
    name: "Newsletter Sponsorship",
    size: "Dedicated slot",
    placement: "footer" as const,
    description: "Sponsored message in the OrbitSphere weekly briefing email.",
    rateFrom: "₦35,000",
    ratePeriod: "/ issue",
  },
] as const;

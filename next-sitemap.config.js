/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://orbitsphere.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    "/admin",
    "/admin/*",
    "/sign-in",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/dashboard/*",
    "/api/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/sign-in", "/register"],
      },
    ],
  },
  additionalPaths: async (config) => {
    const paths = [
      await config.transform(config, "/about"),
      await config.transform(config, "/search"),
    ];

    try {
      const { PrismaClient } = require("@prisma/client");
      const prisma = new PrismaClient();

      const [articles, categories] = await Promise.all([
        prisma.article.findMany({
          where: { status: "published" },
          select: { slug: true, updatedAt: true },
        }),
        prisma.category.findMany({ select: { slug: true } }),
      ]);

      await prisma.$disconnect();

      for (const category of categories) {
        paths.push(
          await config.transform(config, `/${category.slug}`, {
            changefreq: "daily",
            priority: 0.7,
            lastmod: new Date().toISOString(),
          })
        );
      }

      for (const article of articles) {
        paths.push(
          await config.transform(config, `/article/${article.slug}`, {
            changefreq: "daily",
            priority: 0.8,
            lastmod: article.updatedAt.toISOString(),
          })
        );
      }
    } catch {
      const { articles, categories } = require("./sitemap-fallback.json");
      for (const slug of categories) {
        paths.push(await config.transform(config, `/${slug}`));
      }
      for (const slug of articles) {
        paths.push(await config.transform(config, `/article/${slug}`));
      }
    }

    return paths;
  },
};

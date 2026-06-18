import {
  PrismaClient,
  ArticleStatus,
  UserRole,
  AdPlacement,
  CitizenSubmissionStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { articles, categories, articleFeaturedImages } from "../src/lib/data";
import { DEFAULT_SITE_BRANDING } from "../src/lib/site-branding";

const prisma = new PrismaClient();
const SEED_PASSWORD = "Password123!";

const CATEGORY_ICONS: Record<string, string> = {
  politics: "landmark",
  metro: "building-2",
  business: "trending-up",
  technology: "cpu",
  education: "graduation-cap",
  agriculture: "wheat",
  entertainment: "music",
  sports: "trophy",
  opinion: "message-square",
  lifestyle: "heart",
  "faith-culture": "church",
};

const AUTHORS = [
  {
    key: "admin",
    email: "admin@orbitsphere.ng",
    username: "orbit_admin",
    fullName: "Platform Admin",
    role: UserRole.admin,
    bio: "OrbitSphere platform administrator.",
    avatarUrl: "https://picsum.photos/seed/author-admin/200/200",
  },
  {
    key: "adaeze",
    email: "adaeze.okonkwo@orbitsphere.ng",
    username: "adaeze_okonkwo",
    fullName: "Adaeze Okonkwo",
    role: UserRole.editor,
    bio: "Business Editor covering Nigerian and African economic policy.",
    avatarUrl: "https://picsum.photos/seed/author-adaeze/200/200",
  },
  {
    key: "emeka",
    email: "emeka.nwosu@orbitsphere.ng",
    username: "emeka_nwosu",
    fullName: "Emeka Nwosu",
    role: UserRole.journalist,
    bio: "Business and politics correspondent based in Abuja.",
    avatarUrl: "https://picsum.photos/seed/author-emeka/200/200",
  },
  {
    key: "fatima",
    email: "fatima.alhassan@orbitsphere.ng",
    username: "fatima_alhassan",
    fullName: "Fatima Al-Hassan",
    role: UserRole.journalist,
    bio: "Education and metro desk reporter.",
    avatarUrl: "https://picsum.photos/seed/author-fatima/200/200",
  },
  {
    key: "chukwuemeka",
    email: "chukwuemeka.eze@orbitsphere.ng",
    username: "chukwuemeka_eze",
    fullName: "Chukwuemeka Eze",
    role: UserRole.journalist,
    bio: "Agriculture and technology reporter.",
    avatarUrl: "https://picsum.photos/seed/author-chukwuemeka/200/200",
  },
  {
    key: "ngozi",
    email: "ngozi.okafor@orbitsphere.ng",
    username: "ngozi_okafor",
    fullName: "Ngozi Okafor",
    role: UserRole.journalist,
    bio: "Senior economic analyst and opinion columnist.",
    avatarUrl: "https://picsum.photos/seed/author-ngozi/200/200",
  },
] as const;

/** Map mock author ids/names to seeded author keys (5 authors only). */
const AUTHOR_KEY_BY_MOCK_ID: Record<string, (typeof AUTHORS)[number]["key"]> = {
  "1": "adaeze",
  "2": "emeka",
  "3": "fatima",
  "4": "chukwuemeka",
  "5": "ngozi",
  "6": "emeka",
  "7": "ngozi",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("Seeding OrbitSphere database…");

  await prisma.citizenSubmission.deleteMany();
  await prisma.advertiseInquiry.deleteMany();
  await prisma.premiumSubscription.deleteMany();
  await prisma.pollVote.deleteMany();
  await prisma.liveBlogEntry.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.userCategoryFollow.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.article.deleteMany();
  await prisma.advertisement.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);

  const categoryRecords = await Promise.all(
    categories.map((category, index) =>
      prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color,
          icon: CATEGORY_ICONS[category.slug] ?? "newspaper",
          sortOrder: index + 1,
        },
      })
    )
  );

  const categoryBySlug = Object.fromEntries(
    categoryRecords.map((category) => [category.slug, category])
  );

  const authorRecords = await Promise.all(
    AUTHORS.map((author) =>
      prisma.user.create({
        data: {
          email: author.email,
          username: author.username,
          fullName: author.fullName,
          role: author.role,
          bio: author.bio,
          avatarUrl: author.avatarUrl,
          passwordHash,
          isVerified: true,
        },
      })
    )
  );

  const authorByKey: Record<string, (typeof authorRecords)[number]> = {};
  for (let i = 0; i < AUTHORS.length; i++) {
    const author = AUTHORS[i];
    if (author.key === "admin") continue;
    authorByKey[author.key] = authorRecords[i];
  }

  const tagCache = new Map<string, string>();

  async function getOrCreateTagId(name: string): Promise<string> {
    const slug = slugify(name);
    const cached = tagCache.get(slug);
    if (cached) return cached;

    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tagCache.set(slug, tag.id);
    return tag.id;
  }

  for (const article of articles) {
    const authorKey = AUTHOR_KEY_BY_MOCK_ID[article.author.id] ?? "emeka";
    const author = authorByKey[authorKey];
    const category = categoryBySlug[article.category.slug];

    if (!author || !category) {
      throw new Error(
        `Seed mapping failed for "${article.slug}" (author=${authorKey}, category=${article.category.slug})`
      );
    }

    const created = await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        featuredImage:
          articleFeaturedImages[article.slug] ?? article.featuredImage ?? null,
        authorId: author.id,
        categoryId: category.id,
        status: article.status as ArticleStatus,
        isBreaking: article.isBreaking,
        isFeatured: article.isFeatured,
        isInvestigative: article.isInvestigative,
        viewsCount: article.viewsCount,
        readTime: article.readTime,
        publishedAt: article.publishedAt
          ? new Date(article.publishedAt)
          : null,
      },
    });

    if (article.tags?.length) {
      for (const tagName of article.tags) {
        const tagId = await getOrCreateTagId(tagName);
        await prisma.articleTag.create({
          data: {
            articleId: created.id,
            tagId,
          },
        });
      }
    }
  }

  await prisma.advertisement.createMany({
    data: [
      {
        title: "OrbitSphere Premium",
        imageUrl: "https://picsum.photos/seed/ad-leaderboard/728/90",
        targetUrl: "https://orbitsphere.ng/premium",
        placement: AdPlacement.banner,
        isActive: true,
      },
      {
        title: "Africa Business Summit",
        imageUrl: "https://picsum.photos/seed/ad-rectangle/300/250",
        targetUrl: "https://orbitsphere.ng/events",
        placement: AdPlacement.sidebar,
        isActive: true,
      },
    ],
  });

  const reader = await prisma.user.create({
    data: {
      email: "reader@orbitsphere.ng",
      username: "orbit_reader",
      fullName: "Oluwaseun Adeyinka",
      role: UserRole.reader,
      passwordHash,
      isVerified: true,
    },
  });

  const featuredArticle = await prisma.article.findFirst({
    where: { slug: "nigeria-economic-renaissance" },
  });
  const dangoteArticle = await prisma.article.findFirst({
    where: { slug: "dangote-refinery-first-year" },
  });

  if (featuredArticle) {
    const emekaIndex = AUTHORS.findIndex((a) => a.key === "emeka");
    const parent = await prisma.comment.create({
      data: {
        articleId: featuredArticle.id,
        userId: reader.id,
        body: "This is the kind of journalism Nigeria needs more of. Balanced, data-driven, and not afraid to acknowledge the structural challenges that remain.",
        isApproved: true,
      },
    });

    await prisma.comment.create({
      data: {
        articleId: featuredArticle.id,
        userId: authorRecords[emekaIndex].id,
        parentId: parent.id,
        body: "The export to West Africa angle is what excites me most. If Nigeria can become a reliable regional energy supplier, the geopolitical implications are enormous.",
        isApproved: true,
      },
    });

    await prisma.comment.create({
      data: {
        articleId: featuredArticle.id,
        userId: reader.id,
        body: "Has anyone verified the GDP growth figures cited here? Would love to see the raw NBS data.",
        isApproved: false,
      },
    });
  }

  if (dangoteArticle) {
    await prisma.comment.create({
      data: {
        articleId: dangoteArticle.id,
        userId: reader.id,
        body: "The point about pipeline infrastructure is critical — we've heard this for years.",
        isApproved: true,
      },
    });
  }

  await prisma.citizenSubmission.createMany({
    data: [
      {
        submitterName: "Amina Bello",
        email: "amina.bello@example.com",
        title: "Flooding in Makurdi: Residents Share Their Stories",
        body: "Three weeks of heavy rains have displaced over 200 families in Makurdi. I have photos and interviews with local officials documenting the response from the Benue State emergency agency.",
        status: CitizenSubmissionStatus.pending,
      },
      {
        submitterName: "Tunde Bakare",
        email: "tunde.b@example.com",
        title: "Market Women Protest New Levies in Ibadan",
        body: "Traders at Bodija Market staged a peaceful protest yesterday against newly imposed daily levies. I witnessed the demonstration and spoke with the market association chairperson.",
        mediaUrl: "https://picsum.photos/seed/citizen-ibadan/800/450",
        status: CitizenSubmissionStatus.pending,
      },
      {
        submitterName: "Grace Okon",
        email: "grace.okon@example.com",
        title: "Community Library Revival in Calabar",
        body: "Volunteers have restored a abandoned colonial-era library. The story covers fundraising, volunteer efforts, and the first reading sessions for local children.",
        status: CitizenSubmissionStatus.reviewed,
      },
    ],
  });

  if (dangoteArticle) {
    await prisma.poll.create({
      data: {
        question:
          "Will Dangote Refinery achieve full capacity by end of 2026?",
        articleId: dangoteArticle.id,
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        options: {
          create: [
            { optionText: "Yes — on track", voteCount: 842 },
            { optionText: "Partially — delays likely", voteCount: 1203 },
            { optionText: "No — major setbacks ahead", voteCount: 356 },
          ],
        },
      },
    });
  }

  const liveArticle = await prisma.article.findFirst({
    where: { slug: "super-eagles-afcon-tactical-blueprint" },
  });
  if (liveArticle) {
    await prisma.article.update({
      where: { id: liveArticle.id },
      data: { isLiveBlog: true },
    });
    const emekaIndex = AUTHORS.findIndex((a) => a.key === "emeka");
    await prisma.liveBlogEntry.createMany({
      data: [
        {
          articleId: liveArticle.id,
          authorId: authorRecords[emekaIndex].id,
          body: "<p><strong>18:42 WAT</strong> — Nigeria's starting XI confirmed. Osimhen leads the line with Lookman and Simon on the wings.</p>",
          isPinned: true,
        },
        {
          articleId: liveArticle.id,
          authorId: authorRecords[emekaIndex].id,
          body: "<p><strong>17:15 WAT</strong> — Team bus arrives at the stadium. Fans gathering outside in green and white.</p>",
        },
        {
          articleId: liveArticle.id,
          authorId: authorRecords[emekaIndex].id,
          body: "<p><strong>16:00 WAT</strong> — Press conference ends. Coach Peseiro emphasizes defensive solidity in the first half.</p>",
        },
      ],
    });
  }

  const politicsCat = categoryBySlug["politics"];
  const businessCat = categoryBySlug["business"];
  if (politicsCat && businessCat) {
    await prisma.userCategoryFollow.createMany({
      data: [
        { userId: reader.id, categoryId: politicsCat.id },
        { userId: reader.id, categoryId: businessCat.id },
      ],
    });
  }

  await prisma.siteBranding.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      ...DEFAULT_SITE_BRANDING,
    },
  });

  console.log(
    `Done: ${categoryRecords.length} categories, ${authorRecords.length} users (${AUTHORS.length - 1} authors + admin), ${articles.length} articles, ${tagCache.size} tags.`
  );
  console.log(`Seed password for all users: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

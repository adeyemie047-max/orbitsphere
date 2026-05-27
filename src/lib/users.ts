import { db } from "@/lib/db";

export async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      username: true,
      role: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      createdAt: true,
      _count: { select: { bookmarks: true, comments: true } },
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    isVerified: user.isVerified,
    createdAt: user.createdAt.toISOString(),
    bookmarkCount: user._count.bookmarks,
    commentCount: user._count.comments,
  };
}

export async function getPublicProfile(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      fullName: true,
      username: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      role: true,
      createdAt: true,
      _count: { select: { articles: true, comments: true } },
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    isVerified: user.isVerified,
    role: user.role,
    memberSince: user.createdAt.toISOString(),
    articleCount: user._count.articles,
    commentCount: user._count.comments,
  };
}

export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string;
    bio?: string | null;
    avatarUrl?: string | null;
  }
) {
  return db.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      fullName: true,
      username: true,
      bio: true,
      avatarUrl: true,
    },
  });
}

export async function getFeedPreferences(userId: string) {
  const follows = await db.userCategoryFollow.findMany({
    where: { userId },
    include: { category: { select: { id: true, name: true, slug: true, color: true } } },
  });
  return follows.map((f) => f.category);
}

export async function setFeedPreferences(userId: string, categoryIds: string[]) {
  await db.userCategoryFollow.deleteMany({ where: { userId } });
  if (categoryIds.length === 0) return [];

  await db.userCategoryFollow.createMany({
    data: categoryIds.map((categoryId) => ({ userId, categoryId })),
    skipDuplicates: true,
  });

  return getFeedPreferences(userId);
}

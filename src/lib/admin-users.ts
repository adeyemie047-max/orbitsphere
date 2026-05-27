import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function listAdminUsers(options: {
  page: number;
  limit: number;
  role?: UserRole;
  q?: string;
}) {
  const where = {
    ...(options.role ? { role: options.role } : {}),
    ...(options.q
      ? {
          OR: [
            { email: { contains: options.q, mode: "insensitive" as const } },
            { fullName: { contains: options.q, mode: "insensitive" as const } },
            { username: { contains: options.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
        _count: { select: { articles: true, comments: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  return {
    data: users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      username: u.username,
      role: u.role,
      avatarUrl: u.avatarUrl,
      isVerified: u.isVerified,
      createdAt: u.createdAt.toISOString(),
      articleCount: u._count.articles,
      commentCount: u._count.comments,
    })),
    total,
    page: options.page,
    limit: options.limit,
  };
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  actorId: string
) {
  if (userId === actorId && role !== UserRole.admin) {
    throw new Error("Cannot demote your own admin account");
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  });

  return user;
}

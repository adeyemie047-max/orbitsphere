import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function listAdminCategories() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    color: c.color,
    icon: c.icon,
    sortOrder: c.sortOrder,
    articleCount: c._count.articles,
  }));
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  sortOrder?: number;
}) {
  const slug = input.slug ?? slugify(input.name);

  const maxOrder = await db.category.aggregate({ _max: { sortOrder: true } });

  return db.category.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? null,
      color: input.color ?? null,
      icon: input.icon ?? null,
      sortOrder: input.sortOrder ?? (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });
}

export async function updateCategory(
  id: string,
  input: {
    name?: string;
    slug?: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
    sortOrder?: number;
  }
) {
  return db.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
  });
}

export async function deleteCategory(id: string) {
  const count = await db.article.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error("Category has articles and cannot be deleted");
  }
  await db.category.delete({ where: { id } });
}

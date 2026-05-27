import { db } from "@/lib/db";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export async function uniqueArticleSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(title) || "article";

  for (let n = 0; n < 100; n++) {
    const slug = n === 0 ? base : `${base}-${n}`;
    const existing = await db.article.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return slug;
  }

  return `${base}-${Date.now()}`;
}

export function estimateReadTime(htmlOrText: string): number {
  const text = htmlOrText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

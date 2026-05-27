import { revalidatePath, revalidateTag } from "next/cache";

/** Invalidate public caches after an article is published or updated. */
export async function revalidateArticlePages(
  slug: string,
  categorySlug: string
) {
  revalidateTag("homepage");
  revalidateTag("breaking-headlines");
  revalidateTag("articles");
  revalidateTag(`article-${slug}`);
  revalidateTag(`category-${categorySlug}`);

  revalidatePath("/");
  revalidatePath(`/article/${slug}`);
  revalidatePath(`/${categorySlug}`);
  revalidatePath("/search");
}

import { z } from "zod";

const imageRefSchema = z.union([
  z.string().url(),
  z.string().regex(/^\//, "Must be an absolute URL or site path"),
  z.null(),
]);

export const articleBodySchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  slug: z.string().max(500).optional(),
  excerpt: z.string().max(2000).optional().nullable(),
  body: z.string().optional().nullable(),
  featuredImage: imageRefSchema.optional(),
  categoryId: z.string().uuid("Valid category is required"),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  isBreaking: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isInvestigative: z.boolean().optional(),
  submittedForReview: z.boolean().optional(),
});

export const articleUpdateSchema = articleBodySchema.partial().extend({
  title: z.string().min(1).max(500).optional(),
});

export type ArticleBodyInput = z.infer<typeof articleBodySchema>;

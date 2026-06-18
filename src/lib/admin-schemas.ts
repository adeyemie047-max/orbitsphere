import { z } from "zod";
import { AdPlacement, CitizenSubmissionStatus, UserRole } from "@prisma/client";

export const roleUpdateSchema = z.object({
  role: z.enum(["admin", "editor", "journalist", "reader"]),
});

export const staffInviteSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().min(2).max(255),
  username: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9_]+$/, "Username may only contain lowercase letters, numbers, and underscores"),
  role: z.enum(["admin", "editor", "journalist"]),
});

export const articleReviewSchema = z.object({
  action: z.enum(["publish", "return"]),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().max(20).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const adCreateSchema = z.object({
  title: z.string().max(255).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  targetUrl: z.string().url().optional().nullable(),
  placement: z.enum(["banner", "sidebar", "inline", "footer"]),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

export const adUpdateSchema = adCreateSchema.partial();

export const advertiseInquirySchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  company: z.string().max(255).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  message: z.string().min(10).max(2000),
});

export const citizenSubmitSchema = z.object({
  submitterName: z.string().min(1).max(255),
  email: z.string().email().max(255),
  title: z.string().min(1).max(500),
  body: z.string().min(20).max(10000),
  mediaUrl: z.string().url().optional().nullable(),
});

export const citizenReviewSchema = z.object({
  status: z.enum(["reviewed", "approved", "rejected"]),
});

const optionalUrl = z.union([z.string().url(), z.literal(""), z.null()]).optional();

export const brandingUpdateSchema = z.object({
  siteNamePrimary: z.string().min(1).max(100).optional(),
  siteNameAccent: z.string().min(1).max(100).optional(),
  siteTagline: z.string().min(1).max(255).optional(),
  mastheadLocations: z.string().min(1).max(255).optional(),
  siteDescription: z.string().min(1).max(5000).optional(),
  footerDescription: z.string().min(1).max(2000).optional(),
  newsletterHeading: z.string().min(1).max(255).optional(),
  newsletterDescription: z.string().min(1).max(1000).optional(),
  newsletterTagline: z.string().min(1).max(255).optional(),
  copyrightName: z.string().min(1).max(255).optional(),
  copyrightYear: z.number().int().min(2000).max(2100).optional(),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  accentColor: z.string().max(20).optional(),
  inkColor: z.string().max(20).optional(),
  paperColor: z.string().max(20).optional(),
  seoTitle: z.string().min(1).max(255).optional(),
  seoDescription: z.string().min(1).max(500).optional(),
  ogImageUrl: optionalUrl,
  twitterUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  instagramUrl: optionalUrl,
  contactEmail: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  contactPhone: z.string().max(50).optional().nullable(),
  contactAddress: z.string().max(500).optional().nullable(),
});

export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type AdCreateInput = z.infer<typeof adCreateSchema>;
export type CitizenSubmitInput = z.infer<typeof citizenSubmitSchema>;

export const ASSIGNABLE_ROLES: UserRole[] = [
  UserRole.admin,
  UserRole.editor,
  UserRole.journalist,
  UserRole.reader,
];

export const AD_PLACEMENTS = Object.values(AdPlacement);
export const CITIZEN_STATUSES = Object.values(CitizenSubmissionStatus);

import { z } from "zod";
import { AdPlacement, CitizenSubmissionStatus, UserRole } from "@prisma/client";

export const roleUpdateSchema = z.object({
  role: z.enum(["admin", "editor", "journalist", "reader"]),
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

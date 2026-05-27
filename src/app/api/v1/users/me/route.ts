import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getFeedPreferences,
  getUserProfile,
  setFeedPreferences,
  updateUserProfile,
} from "@/lib/users";
import { isUserSession, requireUserSession } from "@/lib/api-auth";
import { parseJsonBody } from "@/lib/api-admin";

const profileUpdateSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  bio: z.string().max(500).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export async function GET() {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  try {
    const [profile, preferences] = await Promise.all([
      getUserProfile(session.userId),
      getFeedPreferences(session.userId),
    ]);
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      data: { ...profile, feedPreferences: preferences },
    });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireUserSession();
  if (!isUserSession(session)) return session;

  const body = await parseJsonBody<unknown>(request);
  if (body instanceof NextResponse) return body;

  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  try {
    const updated = await updateUserProfile(session.userId, parsed.data);
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

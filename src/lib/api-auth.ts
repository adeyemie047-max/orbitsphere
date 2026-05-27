import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isDashboardRole } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";

export type EditorialSession = {
  userId: string;
  role: UserRole;
  email: string;
};

export type UserSession = EditorialSession;

export async function requireUserSession(): Promise<
  UserSession | NextResponse
> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return {
    userId: session.user.id,
    role: session.user.role as UserRole,
    email: session.user.email ?? "",
  };
}

export async function requireEditorialSession(): Promise<
  EditorialSession | NextResponse
> {
  const session = await auth();

  if (!session?.user?.id || !isDashboardRole(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return {
    userId: session.user.id,
    role: session.user.role as UserRole,
    email: session.user.email ?? "",
  };
}

export function isEditorialSession(
  result: EditorialSession | NextResponse
): result is EditorialSession {
  return "userId" in result;
}

export function isUserSession(
  result: UserSession | NextResponse
): result is UserSession {
  return "userId" in result;
}

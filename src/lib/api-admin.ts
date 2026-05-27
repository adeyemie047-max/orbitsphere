import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import {
  isEditorialSession,
  requireEditorialSession,
  type EditorialSession,
} from "@/lib/api-auth";

export function forbidden(message = "Forbidden"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function requireEditorialRole(
  allowed: UserRole[]
): Promise<EditorialSession | NextResponse> {
  const session = await requireEditorialSession();
  if (!isEditorialSession(session)) return session;
  if (!allowed.includes(session.role)) return forbidden();
  return session;
}

export async function requireAdmin(): Promise<EditorialSession | NextResponse> {
  return requireEditorialRole(["admin"]);
}

export async function requireModerator(): Promise<
  EditorialSession | NextResponse
> {
  return requireEditorialRole(["admin", "editor"]);
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
  );
  return { page, limit, skip: (page - 1) * limit };
}

export async function parseJsonBody<T>(
  request: Request
): Promise<T | NextResponse> {
  try {
    return (await request.json()) as T;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

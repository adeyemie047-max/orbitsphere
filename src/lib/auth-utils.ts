import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isDashboardRole } from "@/lib/rbac";
import type { UserRole } from "@prisma/client";

export async function requireDashboardSession(callbackUrl = "/dashboard") {
  const session = await auth();

  if (!session?.user?.id || !isDashboardRole(session.user.role)) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return {
    userId: session.user.id,
    role: session.user.role as UserRole,
    name: session.user.name ?? "Editor",
    email: session.user.email ?? "",
  };
}

export async function getOptionalUserSession() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    userId: session.user.id,
    role: session.user.role as UserRole,
    name: session.user.name ?? "Reader",
    email: session.user.email ?? "",
  };
}

export async function requireUserSessionPage(callbackUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return {
    userId: session.user.id,
    role: session.user.role as UserRole,
    name: session.user.name ?? "Reader",
    email: session.user.email ?? "",
  };
}

import type { UserRole } from "@prisma/client";

/** Roles allowed into the editorial dashboard (/dashboard). */
export const DASHBOARD_ROLES: UserRole[] = ["admin", "editor", "journalist"];

export function isDashboardRole(role: UserRole | undefined): boolean {
  return !!role && DASHBOARD_ROLES.includes(role);
}

export function hasRole(
  role: UserRole | undefined,
  allowed: UserRole[]
): boolean {
  return !!role && allowed.includes(role);
}

export function canManageUsers(role: UserRole | undefined): boolean {
  return role === "admin";
}

export function canPublishAnyArticle(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor";
}

export function canModerateComments(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor";
}

export function canWriteArticles(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor" || role === "journalist";
}

export function canViewAnalytics(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor";
}

export function canEditArticle(
  role: UserRole | undefined,
  userId: string,
  authorId: string
): boolean {
  if (!role) return false;
  if (role === "admin" || role === "editor") return true;
  if (role === "journalist") return userId === authorId;
  return false;
}

export function canDeleteArticle(
  role: UserRole | undefined,
  userId: string,
  authorId: string
): boolean {
  if (!role) return false;
  if (role === "admin" || role === "editor") return true;
  return false;
}

export function canPublishArticle(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor";
}

export function canManageAds(role: UserRole | undefined): boolean {
  return role === "admin";
}

export function canManageCategories(role: UserRole | undefined): boolean {
  return role === "admin";
}

export function canReviewCitizenSubmissions(role: UserRole | undefined): boolean {
  return role === "admin" || role === "editor";
}

export type ArticleAction = "edit" | "publish" | "archive" | "delete" | "view";

export function getArticleActions(
  role: UserRole | undefined,
  userId: string,
  authorId: string,
  status: string
): ArticleAction[] {
  const actions: ArticleAction[] = [];

  if (status === "published") {
    actions.push("view");
  }

  if (canEditArticle(role, userId, authorId)) {
    actions.push("edit");
  }

  if (canPublishArticle(role) && (status === "draft" || status === "scheduled")) {
    actions.push("publish");
  }

  if (canPublishArticle(role) && status === "published") {
    actions.push("archive");
  }

  if (canDeleteArticle(role, userId, authorId)) {
    actions.push("delete");
  }

  return actions;
}

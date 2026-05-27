import webpush from "web-push";
import { db } from "@/lib/db";
import { NotificationType } from "@prisma/client";

export function isPushConfigured(): boolean {
  return !!(
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT
  );
}

export function getVapidPublicKey(): string | null {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}

export function configureWebPush() {
  if (!isPushConfigured()) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  return true;
}

export async function savePushSubscription(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
) {
  return db.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    update: {
      userId,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
}

export async function removePushSubscription(userId: string, endpoint: string) {
  await db.pushSubscription.deleteMany({ where: { userId, endpoint } });
}

export async function listNotifications(userId: string, limit = 20) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function markNotificationRead(userId: string, id: string) {
  return db.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!configureWebPush()) return;

  const subs = await db.pushSubscription.findMany({ where: { userId } });
  const body = JSON.stringify(payload);

  await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        body
      )
    )
  );
}

export async function notifyBreakingNews(title: string, slug: string) {
  const subs = await db.pushSubscription.findMany({ select: { userId: true } });
  const userIds = [...new Set(subs.map((s) => s.userId))];

  for (const userId of userIds) {
    await db.notification.create({
      data: {
        userId,
        type: NotificationType.breaking,
        message: title,
        link: `/article/${slug}`,
      },
    });
    await sendPushToUser(userId, {
      title: "Breaking News",
      body: title,
      url: `/article/${slug}`,
    });
  }
}

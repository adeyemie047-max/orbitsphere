import { db } from "@/lib/db";

function isAdLive(
  ad: { isActive: boolean; startsAt: Date | null; endsAt: Date | null },
  now = new Date()
) {
  if (!ad.isActive) return false;
  if (ad.startsAt && ad.startsAt > now) return false;
  if (ad.endsAt && ad.endsAt < now) return false;
  return true;
}

export async function trackAdImpression(id: string): Promise<boolean> {
  const ad = await db.advertisement.findUnique({ where: { id } });
  if (!ad || !isAdLive(ad)) return false;

  await db.advertisement.update({
    where: { id },
    data: { impressions: { increment: 1 } },
  });
  return true;
}

export async function trackAdClick(id: string): Promise<boolean> {
  const ad = await db.advertisement.findUnique({ where: { id } });
  if (!ad || !isAdLive(ad)) return false;

  await db.advertisement.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  });
  return true;
}

import { AdPlacement } from "@prisma/client";
import { db } from "@/lib/db";

export async function listAdminAds() {
  const ads = await db.advertisement.findMany({
    orderBy: { title: "asc" },
  });

  return ads.map((ad) => ({
    id: ad.id,
    title: ad.title,
    imageUrl: ad.imageUrl,
    targetUrl: ad.targetUrl,
    placement: ad.placement,
    isActive: ad.isActive,
    startsAt: ad.startsAt?.toISOString() ?? null,
    endsAt: ad.endsAt?.toISOString() ?? null,
    impressions: ad.impressions,
    clicks: ad.clicks,
  }));
}

export async function createAd(input: {
  title?: string | null;
  imageUrl?: string | null;
  targetUrl?: string | null;
  placement: AdPlacement;
  isActive: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
}) {
  return db.advertisement.create({
    data: {
      title: input.title ?? null,
      imageUrl: input.imageUrl ?? null,
      targetUrl: input.targetUrl ?? null,
      placement: input.placement,
      isActive: input.isActive,
      startsAt: input.startsAt ?? null,
      endsAt: input.endsAt ?? null,
    },
  });
}

export async function updateAd(
  id: string,
  input: {
    title?: string | null;
    imageUrl?: string | null;
    targetUrl?: string | null;
    placement?: AdPlacement;
    isActive?: boolean;
    startsAt?: Date | null;
    endsAt?: Date | null;
  }
) {
  return db.advertisement.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      ...(input.targetUrl !== undefined ? { targetUrl: input.targetUrl } : {}),
      ...(input.placement !== undefined ? { placement: input.placement } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.startsAt !== undefined ? { startsAt: input.startsAt } : {}),
      ...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
    },
  });
}

export async function getAdById(id: string) {
  return db.advertisement.findUnique({ where: { id } });
}

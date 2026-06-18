-- SiteBranding singleton table (run manually if `prisma db push` is unavailable)

CREATE TABLE IF NOT EXISTS "site_branding" (
  "id" VARCHAR(32) NOT NULL,
  "site_name_primary" VARCHAR(100) NOT NULL DEFAULT 'Orbit',
  "site_name_accent" VARCHAR(100) NOT NULL DEFAULT 'Sphere',
  "site_tagline" VARCHAR(255) NOT NULL DEFAULT 'Independent · African',
  "masthead_locations" VARCHAR(255) NOT NULL DEFAULT 'Lagos · Abuja · London',
  "site_description" TEXT NOT NULL DEFAULT '',
  "footer_description" TEXT NOT NULL DEFAULT '',
  "newsletter_heading" VARCHAR(255) NOT NULL DEFAULT 'Smart news, zero noise',
  "newsletter_description" TEXT NOT NULL DEFAULT '',
  "newsletter_tagline" VARCHAR(255) NOT NULL DEFAULT '',
  "copyright_name" VARCHAR(255) NOT NULL DEFAULT 'OrbitSphere Media Limited',
  "copyright_year" INTEGER NOT NULL DEFAULT 2026,
  "logo_url" TEXT,
  "favicon_url" TEXT,
  "accent_color" VARCHAR(7) NOT NULL DEFAULT '#C8FF00',
  "ink_color" VARCHAR(7) NOT NULL DEFAULT '#0A0A0A',
  "paper_color" VARCHAR(7) NOT NULL DEFAULT '#F5F5F0',
  "seo_title" VARCHAR(255) NOT NULL DEFAULT 'OrbitSphere — Independent African Journalism',
  "seo_description" TEXT NOT NULL DEFAULT '',
  "og_image_url" TEXT,
  "twitter_url" TEXT,
  "facebook_url" TEXT,
  "linkedin_url" TEXT,
  "youtube_url" TEXT,
  "instagram_url" TEXT,
  "contact_email" VARCHAR(255),
  "contact_phone" VARCHAR(50),
  "contact_address" TEXT,
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "site_branding_pkey" PRIMARY KEY ("id")
);

INSERT INTO "site_branding" ("id")
VALUES ('default')
ON CONFLICT ("id") DO NOTHING;

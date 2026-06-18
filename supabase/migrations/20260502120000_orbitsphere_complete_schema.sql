-- =============================================================================
-- OrbitSphere — Complete Supabase Database Schema
-- Run this file in the Supabase SQL Editor (Dashboard → SQL → New query)
-- =============================================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'journalist', 'reader');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.article_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.notification_type AS ENUM ('breaking', 'reply', 'recommendation');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Utility functions ────────────────────────────────────────────────────────

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Auto-create profile when a Supabase auth user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ─── 1. profiles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name     VARCHAR(255),
  username      VARCHAR(100) UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  role          public.user_role NOT NULL DEFAULT 'reader',
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Role helpers for RLS (must exist after profiles table)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_editorial()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor', 'journalist')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
  );
$$;

-- ─── 2. categories ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color       VARCHAR(20),
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories (sort_order);

-- ─── 3. articles ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             VARCHAR(500) NOT NULL,
  slug              VARCHAR(500) NOT NULL UNIQUE,
  excerpt           TEXT,
  body              TEXT,
  featured_image    TEXT,
  image_caption     TEXT,
  author_id         UUID NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
  category_id       UUID NOT NULL REFERENCES public.categories (id) ON DELETE RESTRICT,
  status            public.article_status NOT NULL DEFAULT 'draft',
  is_breaking       BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  is_investigative  BOOLEAN NOT NULL DEFAULT FALSE,
  ai_summary        TEXT,
  views_count       INT NOT NULL DEFAULT 0,
  read_time         INT,
  published_at      TIMESTAMPTZ,
  scheduled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_status_published_at
  ON public.articles (status, published_at DESC NULLS LAST)
  WHERE status = 'published';

DROP TRIGGER IF EXISTS set_articles_updated_at ON public.articles;
CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 4. tags + article_tags ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tags (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags (slug);

CREATE TABLE IF NOT EXISTS public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles (id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES public.tags (id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON public.article_tags (tag_id);

-- ─── 5. comments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body        TEXT NOT NULL,
  article_id  UUID NOT NULL REFERENCES public.articles (id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES public.comments (id) ON DELETE CASCADE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments (article_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments (parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON public.comments (article_id, is_approved)
  WHERE is_approved = TRUE;

-- ─── 6. bookmarks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.articles (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_article_id ON public.bookmarks (article_id);

-- ─── 7. newsletter_subscribers ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active
  ON public.newsletter_subscribers (is_active)
  WHERE is_active = TRUE;

-- ─── 8. polls + poll_options + poll_votes ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.polls (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT NOT NULL,
  article_id UUID REFERENCES public.articles (id) ON DELETE SET NULL,
  ends_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_polls_article_id ON public.polls (article_id);

CREATE TABLE IF NOT EXISTS public.poll_options (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     UUID NOT NULL REFERENCES public.polls (id) ON DELETE CASCADE,
  option_text VARCHAR(255) NOT NULL,
  vote_count  INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON public.poll_options (poll_id);

CREATE TABLE IF NOT EXISTS public.poll_votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id    UUID NOT NULL REFERENCES public.polls (id) ON DELETE CASCADE,
  option_id  UUID NOT NULL REFERENCES public.poll_options (id) ON DELETE CASCADE,
  user_id    UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  voter_key  VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (poll_id, voter_key)
);

CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON public.poll_votes (poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON public.poll_votes (user_id);

-- ─── 9. notifications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type       public.notification_type NOT NULL,
  message    TEXT,
  link       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON public.notifications (user_id, is_read)
  WHERE is_read = FALSE;

-- ─── Auth trigger: auto-create profile ────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ─── profiles ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Prevent privilege escalation; only admins may change roles
    AND (
      role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      OR public.current_user_role() = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.current_user_role() = 'admin');

-- ─── categories ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Editorial staff can manage categories" ON public.categories;
CREATE POLICY "Editorial staff can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin_or_editor())
  WITH CHECK (public.is_admin_or_editor());

-- ─── articles ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Published articles are public" ON public.articles;
CREATE POLICY "Published articles are public"
  ON public.articles FOR SELECT
  USING (
    status = 'published'
    OR public.is_editorial()
    OR author_id = auth.uid()
  );

DROP POLICY IF EXISTS "Editorial staff can create articles" ON public.articles;
CREATE POLICY "Editorial staff can create articles"
  ON public.articles FOR INSERT
  WITH CHECK (public.is_editorial());

DROP POLICY IF EXISTS "Editorial staff and authors can update articles" ON public.articles;
CREATE POLICY "Editorial staff and authors can update articles"
  ON public.articles FOR UPDATE
  USING (
    public.is_admin_or_editor()
    OR (author_id = auth.uid() AND status IN ('draft', 'scheduled'))
  )
  WITH CHECK (
    public.is_admin_or_editor()
    OR (author_id = auth.uid() AND status IN ('draft', 'scheduled'))
  );

DROP POLICY IF EXISTS "Admins and editors can delete articles" ON public.articles;
CREATE POLICY "Admins and editors can delete articles"
  ON public.articles FOR DELETE
  USING (public.is_admin_or_editor());

-- ─── tags ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Editorial staff can manage tags" ON public.tags;
CREATE POLICY "Editorial staff can manage tags"
  ON public.tags FOR ALL
  USING (public.is_editorial())
  WITH CHECK (public.is_editorial());

-- ─── article_tags ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Article tags are viewable by everyone" ON public.article_tags;
CREATE POLICY "Article tags are viewable by everyone"
  ON public.article_tags FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Editorial staff can manage article tags" ON public.article_tags;
CREATE POLICY "Editorial staff can manage article tags"
  ON public.article_tags FOR ALL
  USING (public.is_editorial())
  WITH CHECK (public.is_editorial());

-- ─── comments ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Approved comments are public" ON public.comments;
CREATE POLICY "Approved comments are public"
  ON public.comments FOR SELECT
  USING (
    is_approved = TRUE
    OR user_id = auth.uid()
    OR public.is_editorial()
  );

DROP POLICY IF EXISTS "Authenticated users can post comments" ON public.comments;
CREATE POLICY "Authenticated users can post comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND is_approved = FALSE
  );

DROP POLICY IF EXISTS "Users can update their own pending comments" ON public.comments;
CREATE POLICY "Users can update their own pending comments"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid() AND is_approved = FALSE)
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Editorial staff can moderate comments" ON public.comments;
CREATE POLICY "Editorial staff can moderate comments"
  ON public.comments FOR UPDATE
  USING (public.is_editorial());

DROP POLICY IF EXISTS "Users can delete own comments or editorial can delete any" ON public.comments;
CREATE POLICY "Users can delete own comments or editorial can delete any"
  ON public.comments FOR DELETE
  USING (user_id = auth.uid() OR public.is_editorial());

-- ─── bookmarks ────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can create their own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ─── newsletter_subscribers ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Editorial staff can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Editorial staff can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (public.is_admin_or_editor());

DROP POLICY IF EXISTS "Editorial staff can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Editorial staff can manage subscribers"
  ON public.newsletter_subscribers FOR UPDATE
  USING (public.is_admin_or_editor());

-- ─── polls ────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Polls are viewable by everyone" ON public.polls;
CREATE POLICY "Polls are viewable by everyone"
  ON public.polls FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Editorial staff can manage polls" ON public.polls;
CREATE POLICY "Editorial staff can manage polls"
  ON public.polls FOR ALL
  USING (public.is_editorial())
  WITH CHECK (public.is_editorial());

-- ─── poll_options ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Poll options are viewable by everyone" ON public.poll_options;
CREATE POLICY "Poll options are viewable by everyone"
  ON public.poll_options FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Editorial staff can manage poll options" ON public.poll_options;
CREATE POLICY "Editorial staff can manage poll options"
  ON public.poll_options FOR ALL
  USING (public.is_editorial())
  WITH CHECK (public.is_editorial());

-- ─── poll_votes ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own poll votes" ON public.poll_votes;
CREATE POLICY "Users can view their own poll votes"
  ON public.poll_votes FOR SELECT
  USING (user_id = auth.uid() OR public.is_editorial());

DROP POLICY IF EXISTS "Authenticated users can vote in polls" ON public.poll_votes;
CREATE POLICY "Authenticated users can vote in polls"
  ON public.poll_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anonymous users can vote with voter_key" ON public.poll_votes;
CREATE POLICY "Anonymous users can vote with voter_key"
  ON public.poll_votes FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND voter_key IS NOT NULL);

-- ─── notifications ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications for users" ON public.notifications;
CREATE POLICY "System can insert notifications for users"
  ON public.notifications FOR INSERT
  WITH CHECK (public.is_editorial() OR auth.uid() = user_id);

-- =============================================================================
-- SEED DATA — 11 OrbitSphere categories
-- =============================================================================
INSERT INTO public.categories (id, name, slug, description, color, sort_order)
VALUES
  (
    gen_random_uuid(),
    'Politics',
    'politics',
    'In-depth coverage of Nigerian and African politics, elections, policy, and governance.',
    'gold',
    1
  ),
  (
    gen_random_uuid(),
    'Metro',
    'metro',
    'City news, transport, infrastructure, and life across Nigeria''s urban centres.',
    'gold',
    2
  ),
  (
    gen_random_uuid(),
    'Business',
    'business',
    'Markets, finance, corporate news, and economic analysis for Africa.',
    'gold',
    3
  ),
  (
    gen_random_uuid(),
    'Technology',
    'technology',
    'Startups, innovation, AI, and the digital transformation of Africa.',
    'cyan',
    4
  ),
  (
    gen_random_uuid(),
    'Education',
    'education',
    'Schools, universities, policy reforms, and the future of learning.',
    'cyan',
    5
  ),
  (
    gen_random_uuid(),
    'Agriculture',
    'agriculture',
    'Food security, farming innovation, and rural development across the continent.',
    'blue',
    6
  ),
  (
    gen_random_uuid(),
    'Entertainment',
    'entertainment',
    'Music, film, culture, and the creative industries shaping African identity.',
    'gold',
    7
  ),
  (
    gen_random_uuid(),
    'Sports',
    'sports',
    'Football, athletics, and the stories behind Africa''s sporting triumphs.',
    'blue',
    8
  ),
  (
    gen_random_uuid(),
    'Opinion',
    'opinion',
    'Analysis, commentary, and perspectives from Africa''s leading voices.',
    'gold',
    9
  ),
  (
    gen_random_uuid(),
    'Lifestyle',
    'lifestyle',
    'Culture, wellness, travel, and the way Africans live today.',
    'cyan',
    10
  ),
  (
    gen_random_uuid(),
    'Faith & Culture',
    'faith-culture',
    'Religion, tradition, and the cultural forces shaping African society.',
    'gold',
    11
  )
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  color       = EXCLUDED.color,
  sort_order  = EXCLUDED.sort_order;

-- =============================================================================
-- Grants (Supabase authenticated / anon roles)
-- =============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT SELECT ON public.article_tags TO anon, authenticated;
GRANT SELECT ON public.comments TO anon, authenticated;
GRANT SELECT ON public.polls TO anon, authenticated;
GRANT SELECT ON public.poll_options TO anon, authenticated;

GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;

GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.bookmarks TO authenticated;
GRANT ALL ON public.comments TO authenticated;
GRANT INSERT ON public.poll_votes TO anon, authenticated;
GRANT SELECT ON public.poll_votes TO authenticated;
GRANT ALL ON public.notifications TO authenticated;

GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_tags TO authenticated;
GRANT ALL ON public.polls TO authenticated;
GRANT ALL ON public.poll_options TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.categories TO authenticated;

-- =============================================================================
-- Done. Verify with:
--   SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
--   SELECT name, slug FROM public.categories ORDER BY sort_order;
-- =============================================================================

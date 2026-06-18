-- Add Supabase schema columns missing from Prisma articles table
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS image_caption TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT;

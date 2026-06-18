-- Run on production if db:push is unavailable
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS submitted_for_review BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_articles_submitted_for_review
  ON articles (submitted_for_review)
  WHERE submitted_for_review = true;

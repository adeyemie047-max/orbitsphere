# ADR-001: Article Search Architecture

**Status:** Accepted  
**Date:** 2026-05-27  
**Context:** OrbitSphere PRD §7 (search API), §8.1 (navbar search), §11 (SEO), and open question in PRD §14: Algolia vs Elasticsearch vs self-hosted.

## Decision

Use **PostgreSQL full-text search via Prisma** (`contains` + `insensitive` mode) for Phase 1, exposed through:

- `GET /api/v1/articles/search?q=`
- `GET /api/v1/articles?q=` (alias)
- Server-rendered `/search` page
- Mock-data fallback when the database is unavailable

Defer **Algolia** and **Elasticsearch** until search volume, typo-tolerance, or sub-100ms latency requirements justify added cost and ops.

## Rationale

| Option | Pros | Cons |
|--------|------|------|
| **Prisma + PostgreSQL** (chosen) | Zero new infra; works on Neon free tier; same data source as articles; sufficient for ≤20 seeded articles and early traffic | No fuzzy matching; slower at very large scale; basic relevance ranking |
| **Algolia** | Instant search, typo tolerance, analytics | Paid SaaS; sync pipeline; vendor lock-in |
| **Elasticsearch** | Powerful relevance, aggregations | Self-host ops burden; overkill for launch |

For a newspaper MVP with editorial CMS content in PostgreSQL, co-located search avoids sync lag and keeps the stack simple (PRD stack: Next.js + PostgreSQL + Prisma).

## Implementation

```
User → /search?q= or Navbar form
     → searchPublicArticles() in src/lib/search.ts
     → getPublicArticles({ query }) in src/lib/articles-db.ts
     → WHERE title/excerpt/tags/author ILIKE %q%
     → fallback: searchArticles() mock index
```

Published-only filter applies (`status = published`, `publishedAt <= now`).

## SEO

- `WebSite` JSON-LD with `SearchAction` points to `/search?q={search_term_string}`
- `SearchResultsPage` + `ItemList` JSON-LD on results pages

## Realtime breaking ticker (related)

PRD §8.1 specifies WebSocket updates. We use **Server-Sent Events** (`GET /api/v1/breaking/stream`) polling every 30s — compatible with serverless/Neon without a dedicated WebSocket server. Client: `BreakingTickerClient` via `EventSource`.

## Consequences

- **Positive:** Ships with existing Neon DB; no API keys; ADR-friendly upgrade path
- **Negative:** Search quality limited until Phase 2 index
- **Upgrade path:** Add Algolia/Typesense when any trigger hits:
  - \>50k articles or \>100ms p95 search latency
  - Need for faceted filters (date, category, author)
  - Typo-tolerance / “did you mean” requirements

## Future work

1. PostgreSQL `tsvector` + GIN index for proper full-text ranking
2. Optional Algolia sync worker on article publish webhooks
3. Search analytics table (query, result count, timestamp)

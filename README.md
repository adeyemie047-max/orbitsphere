# OrbitSphere Newspaper

**The Future of African Journalism**

A production-ready MVP digital newspaper built with Next.js, based on the OrbitSphere PRD and design template. Premium dark-theme UI with gold accents, full homepage, category pages, article detail pages, search, and REST API stubs.

## Features

- **Homepage** — Hero, breaking ticker, trending, latest news, category sections, video stories, opinion, newsletter
- **Category pages** — Featured article, paginated grid, sidebar with trending + newsletter
- **Article pages** — Full content, AI summary, audio player UI, share bar, comments, related stories, JSON-LD
- **Search** — Full-text search across titles, excerpts, tags, and authors
- **API routes** — `/api/v1/articles`, `/api/v1/categories`, `/api/v1/newsletter/subscribe`
- **SEO** — Dynamic metadata, Open Graph, Twitter cards, sitemap, robots

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Google Fonts (Playfair Display, DM Serif Display, Inter, Poppins)

## Getting Started

### Prerequisites

Install [Node.js 18+](https://nodejs.org/) (includes npm).

### Install & Run

```bash
cd orbitsphere
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
orbitsphere/
├── src/
│   ├── app/                  # Pages & API routes
│   │   ├── page.tsx          # Homepage
│   │   ├── [category]/       # Category pages
│   │   ├── article/[slug]/   # Article detail
│   │   ├── search/           # Search
│   │   └── api/v1/           # REST API
│   ├── components/
│   │   ├── layout/           # Navbar, Footer, Ticker
│   │   ├── homepage/         # Hero, Trending, etc.
│   │   ├── article/          # Cards, ArticleContent
│   │   ├── ui/               # Badge, Button, Logo
│   │   └── shared/           # NewsletterForm
│   └── lib/
│       ├── data.ts           # Mock articles & categories
│       ├── types.ts
│       └── utils.ts
```

## Design System

| Token | Value |
|-------|-------|
| Midnight Blue | `#0A1931` |
| Gold | `#D4AF37` |
| Breaking Red | `#EF4444` |
| Headlines | Playfair Display |
| Body | Inter |
| UI Labels | Poppins |

## Next Steps (PRD Phase 2+)

- PostgreSQL + Prisma database
- NextAuth.js authentication
- Admin dashboard with rich text editor
- WebSocket breaking news ticker
- Cloudinary media uploads
- Algolia/Elasticsearch search

---

© 2026 OrbitSphere Media Limited

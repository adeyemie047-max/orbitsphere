# OrbitSphere Launch Report

**Date:** 27 May 2026  
**Version:** 1.0.0  
**Stack:** Next.js 15 · Vercel · Cloudflare · Neon PostgreSQL

---

## Executive summary

OrbitSphere is launch-ready for a controlled production rollout. Core editorial, reader, and newsroom features are implemented. This report covers performance, accessibility, security, legal compliance pages, E2E test coverage, and the Cloudflare + Vercel + Neon deployment path.

| Area            | Status   | Notes                                      |
|-----------------|----------|--------------------------------------------|
| Performance     | ✅ Ready | ISR, image formats, static cache headers    |
| Accessibility   | ✅ Ready | Skip link, focus-visible, reduced motion    |
| Security        | ✅ Ready | CSP, headers, rate limits, HTML sanitization |
| Legal pages     | ✅ Ready | Privacy, Terms, Cookies, Corrections        |
| E2E tests       | ✅ Ready | Playwright smoke suite + CI                 |
| Production deploy | ✅ Ready | Vercel + Neon + Cloudflare documented     |

---

## 1. Performance

### Implemented

- **ISR:** 60s revalidate on homepage, categories, articles, trending
- **Cache tags:** `revalidateTag` on article publish (`src/lib/revalidate-articles.ts`)
- **Images:** AVIF/WebP via `next.config.ts`; Cloudinary + picsum remote patterns
- **Bundle:** `optimizePackageImports` for TanStack Table and Tiptap
- **Static assets:** `Cache-Control: immutable` for `/_next/static/*`
- **Fonts:** Google fonts with `display: swap`
- **Sitemap:** Generated at build via `next-sitemap`

### Recommendations (post-launch)

- Add `@next/bundle-analyzer` and lazy-load TipTap editor with `next/dynamic`
- Enable Vercel Speed Insights / Web Vitals reporting
- Consider reducing font families from four to two on public pages

---

## 2. Accessibility (WCAG 2.1 AA targets)

### Implemented

| Feature | Location |
|---------|----------|
| Skip to main content | `src/components/layout/SkipLink.tsx` |
| `#main-content` landmark | `PublicSiteShell.tsx` |
| Global `focus-visible` outline | `globals.css` |
| `prefers-reduced-motion` | Disables animations/ticker |
| Cookie consent dialog | `aria-label`, `aria-live` |
| Legal table semantics | `/cookies` policy table |
| Form error alerts | `Input.tsx` (`role="alert"`) |

### Manual QA checklist

- [ ] Tab through homepage, article, sign-in without mouse
- [ ] Screen reader: breaking ticker, poll widget, live blog updates
- [ ] 200% zoom — no horizontal scroll on article pages
- [ ] Color contrast audit on gold text over dark backgrounds

---

## 3. Security

### Implemented

| Control | Details |
|---------|---------|
| Security headers | CSP, HSTS, X-Frame-Options, nosniff — `src/lib/security-headers.ts` |
| HTML sanitization | Article body + live blog — `src/lib/sanitize-html.ts` |
| Rate limiting | Auth (5/15min), comments (20), citizen submit (3), newsletter (10) |
| RBAC | Editorial + reader APIs — `docs/RBAC.md` |
| Cron auth | `Bearer $CRON_SECRET` on publish-scheduled |
| Env validation | `src/lib/env.ts` + production assert in `instrumentation.ts` |
| Auth trust host | `trustHost: true` for Vercel deployment |
| Health check | `GET /api/v1/health` (DB probe) |

### Production env (required)

```env
AUTH_SECRET=           # openssl rand -base64 32
AUTH_URL=https://orbitsphere.ng
DATABASE_URL=          # Neon pooled connection
DIRECT_URL=            # Neon direct (migrations)
CRON_SECRET=           # openssl rand -base64 32
NEXT_PUBLIC_SITE_URL=https://orbitsphere.ng
```

### Known limitations

- Rate limiter is in-memory (per serverless instance). Add Upstash Redis for multi-region durability.
- CSP allows `'unsafe-inline'` for styles (Tailwind). Tighten with nonces in a future pass.

---

## 4. Legal pages

| Route | Purpose |
|-------|---------|
| `/privacy` | NDPA-aligned privacy policy |
| `/terms` | Terms of use |
| `/cookies` | Cookie policy + consent reference |
| `/corrections` | Editorial corrections policy |

Footer links updated. Cookie banner stores consent in `localStorage` (`orbitsphere-cookie-consent`).

**Legal review:** Replace placeholder contact emails and have counsel review before public launch.

---

## 5. E2E tests

**Runner:** Playwright (`e2e/public.spec.ts`)

```bash
npm run test:e2e        # headless
npm run test:e2e:ui     # interactive UI
```

**Coverage:**

- Homepage load + navigation
- Skip link keyboard focus
- All four legal pages
- Article body render
- Sign-in and citizen submit pages
- Health API endpoint
- Footer privacy link navigation

**CI:** `.github/workflows/ci.yml` — lint, build, E2E on push/PR.

---

## 6. Production deployment

### Architecture

```
User → Cloudflare (DNS, WAF, CDN) → Vercel (Next.js 15) → Neon (PostgreSQL)
```

### Step 1 — Neon

1. Create project at [neon.tech](https://neon.tech)
2. Copy **pooled** `DATABASE_URL` and **direct** `DIRECT_URL`
3. Run migrations from local or CI:

```bash
npm run db:push    # or db:migrate for production
npm run db:seed    # staging only
```

### Step 2 — Vercel

1. Import Git repo → root directory: `orbitsphere`
2. Framework: Next.js (auto-detected)
3. Set all env vars from `.env.example`
4. Deploy — `vercel.json` configures cron every 5 min for scheduled publishing
5. Add custom domain; verify SSL

### Step 3 — Cloudflare

See `cloudflare/README.md`:

- CNAME `@` and `www` → Vercel
- SSL: Full (strict)
- Bypass cache for `/api/*`, `/dashboard/*`, auth routes
- Bypass cache for `/sw.js` (Web Push)

### Step 4 — Post-deploy smoke test

```bash
curl https://orbitsphere.ng/api/v1/health
curl https://orbitsphere.ng/api/v1/articles/trending
```

Sign in as `admin@orbitsphere.ng`, publish a test article, confirm ISR revalidation.

### Step 5 — Optional services

| Service | Env vars | Purpose |
|---------|----------|---------|
| Cloudinary | `CLOUDINARY_*` | Image uploads |
| Web Push | `VAPID_*` | Breaking news notifications |
| Google OAuth | `AUTH_GOOGLE_*` | Social sign-in |

---

## 7. Launch checklist

### Pre-launch

- [ ] Neon DB migrated and seeded (staging)
- [ ] All Vercel env vars set for Production
- [ ] `AUTH_URL` matches production domain
- [ ] Cloudflare DNS proxied, SSL strict
- [ ] VAPID keys generated (`npx web-push generate-vapid-keys`)
- [ ] Cron secret set; verify scheduled publish cron in Vercel logs
- [ ] Legal pages reviewed by counsel
- [ ] `npm run build` passes
- [ ] `npm run test:e2e` passes

### Launch day

- [ ] Deploy production branch
- [ ] Health check returns `healthy`
- [ ] Sign-in / sign-out flow
- [ ] Publish breaking article → push notification (if VAPID configured)
- [ ] Monitor Vercel logs + Neon dashboard

### Post-launch (week 1)

- [ ] Lighthouse audit (target: LCP < 2.5s, CLS < 0.1)
- [ ] Enable Vercel Analytics
- [ ] Set up error alerting (Sentry or Vercel log drains)
- [ ] Redis-backed rate limiting if traffic spikes

---

## 8. File reference

| File | Purpose |
|------|---------|
| `next.config.ts` | Security headers, image optimization, cache |
| `src/lib/env.ts` | Environment validation |
| `src/lib/security-headers.ts` | CSP + HSTS |
| `src/lib/sanitize-html.ts` | XSS mitigation for article HTML |
| `src/instrumentation.ts` | Production env assert at boot |
| `playwright.config.ts` | E2E configuration |
| `vercel.json` | Cron + health cache headers |
| `cloudflare/README.md` | DNS and cache rules |
| `.github/workflows/ci.yml` | CI pipeline |
| `docs/RBAC.md` | API access control |

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Engineering | — | 27 May 2026 |
| Editorial | — | |
| Legal | — | |

**OrbitSphere v1.0.0 is cleared for production deployment pending legal review and Neon/Vercel env configuration.**

# OrbitSphere Launch Checklist

Use this checklist to go from local dev to a serious production launch. Code items marked **done** are implemented in the repo; **manual** steps require your Vercel/Neon/DNS accounts.

---

## Must-have before serious launch

### 1. Production database (Neon) — **manual**

- [ ] Create a Neon project at [neon.tech](https://neon.tech) (or via Vercel Marketplace)
- [ ] Copy **pooled** URL → `DATABASE_URL` and **direct** URL → `DIRECT_URL`
- [ ] Add both to Vercel → Project → Settings → Environment Variables (Production)
- [ ] From your machine with production env in `.env.local`:

```powershell
cd "C:\Users\adeye\Desktop\New folder\orbitsphere"
npm run db:setup
```

This runs `prisma db push` + seed (categories, authors, 20 articles, admin user, branding).

- [ ] If `db:push` fails, run manual SQL fallbacks in `prisma/migrations/manual/`:
  - `site_branding.sql`
  - `submitted_for_review.sql`

**Default admin (seed):** `admin@orbitsphere.ng` / `Password123!` — change password after first login.

---

### 2. Cloudinary (production images) — **manual**

- [ ] Create a Cloudinary account and note cloud name, API key, secret
- [ ] Set on Vercel (Production):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- [ ] Redeploy, then upload a test image at `/dashboard/media`
- [ ] **done** — Media library lists Cloudinary assets when configured; shows a warning in dev without it

Without Cloudinary, Vercel serverless cannot persist uploads — images disappear on redeploy.

---

### 3. Core Vercel env vars — **manual**

| Variable | Example / notes |
|----------|-----------------|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | `https://orbitsphere.ng` (or your `.vercel.app` URL) |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_SITE_URL` | Same as public URL |
| `CRON_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | Neon pooled |
| `DIRECT_URL` | Neon direct |

See `.env.example` for optional: Resend, VAPID, Paystack, Google OAuth.

---

### 4. Custom domain + SSL — **manual**

- [ ] Vercel → Domains → add `orbitsphere.ng` and `www`
- [ ] Point DNS (Cloudflare or registrar) per `cloudflare/README.md`
- [ ] Update `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the custom domain
- [ ] Redeploy

---

### 5. Admin dashboard — **done**

| Route | Status |
|-------|--------|
| `/dashboard/users` | List, search, role change, staff invite |
| `/dashboard/comments` | Pending queue, approve/reject |
| `/dashboard/media` | Upload, Cloudinary + local listing, copy URL |
| `/dashboard/review` | Editorial review queue |
| `/dashboard/articles` | Article manager |
| `/dashboard/settings` | Site branding (contact email drives legal pages) |

**Add a journalist:** Dashboard → Users → **Invite staff**, or register at `/register` then promote role to journalist.

---

### 6. Legal pages — **done** (review with counsel)

- [ ] Set real **Contact email** in Dashboard → Settings → Branding
- [ ] Legal pages (`/privacy`, `/terms`, `/cookies`, `/corrections`) derive emails from that contact domain
- [ ] Have a lawyer review copy before public marketing

---

### 7. GitHub + Vercel auto-deploy — **manual**

```powershell
cd "C:\Users\adeye\Desktop\New folder\orbitsphere"
.\scripts\deploy.ps1
```

Or push manually:

```powershell
git add -A
git commit -m "Launch checklist updates"
git push
```

Repo: `https://github.com/adeyemie047-max/orbitsphere.git`

---

## Recommended before marketing push

| Item | Status | Action |
|------|--------|--------|
| Resend email | Optional | Set `RESEND_API_KEY` + verify domain for invites/password reset |
| Web Push | Optional | `npx web-push generate-vapid-keys` → set `VAPID_*` on Vercel |
| Real editorial content | Manual | Replace seed articles via `/dashboard/write` |
| Analytics | Partial | Add GA/Plausible script; dashboard chart uses article view aggregates |
| Paystack premium | Optional | Real products in Paystack dashboard |

---

## Nice-to-have (post-launch)

- Redis rate limiting (currently in-memory per serverless instance)
- Multi-edition (Lagos/Abuja) content model
- Apple News / Google News syndication beyond RSS (`/rss.xml` exists)
- Article paywall (premium is ad-free only today)

---

## Quick verification after deploy

1. `GET https://your-domain/api/v1/health` → `{ "status": "ok" }`
2. Sign in as admin → `/dashboard`
3. Upload image → `/dashboard/media` → URL persists after redeploy (Cloudinary)
4. Approve a test comment → `/dashboard/comments`
5. Invite staff → `/dashboard/users`
6. Homepage loads with live articles (not 503)

---

## Where you left off (June 2026)

The last session was integrating this checklist and auditing admin panels. The codebase already had Users, Comments, and Media UIs built — this pass added:

- Cloudinary asset listing in the media library
- Error feedback on comment moderation
- User list pagination
- Legal pages wired to branding contact email

**Next recommended step:** Run `npm run db:setup` against Neon production, set Cloudinary + core env vars on Vercel, redeploy, then add real contact email in Settings.

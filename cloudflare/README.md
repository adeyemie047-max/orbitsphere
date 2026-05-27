# Cloudflare configuration (DNS + CDN in front of Vercel)

OrbitSphere uses **Cloudflare** for DNS, DDoS protection, and edge caching; **Vercel** hosts the Next.js app; **Neon** provides PostgreSQL.

## DNS records

| Type  | Name | Value                    | Proxy |
|-------|------|--------------------------|-------|
| CNAME | `@`  | `cname.vercel-dns.com`   | Proxied |
| CNAME | `www`| `cname.vercel-dns.com`   | Proxied |

In Vercel → Project → Settings → Domains, add `orbitsphere.ng` and `www.orbitsphere.ng`.

## SSL/TLS

- Cloudflare SSL mode: **Full (strict)**
- Enable **Always Use HTTPS**
- Enable **Automatic HTTPS Rewrites**

## Cache rules

Do **not** cache HTML for authenticated or dynamic routes. Recommended Page Rules / Cache Rules:

1. **Bypass cache:** `/dashboard/*`, `/api/*`, `/sign-in`, `/register`, `/profile`, `/bookmarks`, `/feed`
2. **Cache everything (edge TTL 1 hour):** `/`, `/article/*`, `/_next/static/*`

Static assets are already long-cached via Next.js `headers()` in `next.config.ts`.

## Security (Cloudflare dashboard)

- WAF: Managed ruleset enabled
- Bot Fight Mode: on
- Rate limiting: optional rule on `/api/v1/auth/*` (10 req/min per IP) as belt-and-suspenders with app-level limits

## Environment sync

Set `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to `https://orbitsphere.ng` in Vercel production env.

## Web Push service worker

`public/sw.js` must be served from the same origin. With Cloudflare proxy, ensure `/sw.js` is **not** cached aggressively (Cache Rule: bypass for `/sw.js`).

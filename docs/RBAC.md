# OrbitSphere RBAC



Role-based access control for OrbitSphere, aligned with PRD §7, §8.5 and §11.



## Roles



| Role | Description |

|------|-------------|

| `admin` | Platform manager — full access to users, articles, comments, ads, analytics, categories |

| `editor` | Desk editor — publish/edit/delete any article; approve comments; review citizen submissions |

| `journalist` | Reporter — create and edit own articles; submit for review |

| `reader` | Registered public user — bookmarks, comments, profile (no dashboard) |



Hierarchy for editorial actions: **admin > editor > journalist > reader**.



## Route protection



Middleware (`src/middleware.ts`) protects:



| Route pattern | Who may access |

|---------------|----------------|

| `/dashboard/*` | `admin`, `editor`, `journalist` |

| `/admin/*` | Redirects to `/dashboard/*` (legacy URL) |

| `/sign-in`, `/register`, `/forgot-password`, `/reset-password` | Public |

| Public site (`/`, `/article/*`, etc.) | Everyone |



Unauthenticated users hitting `/dashboard` or `/admin` are redirected to `/sign-in?callbackUrl=…`.



Authenticated **readers** are redirected to `/` — they cannot access the newsroom dashboard.



## Article-level permissions



Server helpers in `src/lib/rbac.ts`:



| Helper | Purpose |

|--------|---------|

| `canEditArticle(role, userId, authorId)` | Edit own (journalist) or any (editor/admin) |

| `canDeleteArticle(role, userId, authorId)` | Delete any (editor/admin only) |

| `canPublishArticle(role)` | Publish or schedule (editor/admin) |

| `canModerateComments(role)` | Approve/delete comments (editor/admin) |

| `canManageUsers(role)` | User list + role assignment (admin) |

| `canManageAds(role)` | Ad CRUD (admin) |

| `canManageCategories(role)` | Category CRUD (admin) |

| `canReviewCitizenSubmissions(role)` | Citizen review queue (admin/editor) |

| `getArticleActions(...)` | UI action buttons for TanStack article manager |



## Permission matrix



| Resource / action | admin | editor | journalist | reader |

|-------------------|:-----:|:------:|:----------:|:------:|

| View published articles (public) | ✓ | ✓ | ✓ | ✓ |

| View draft/scheduled articles | ✓ | ✓ | Own only | ✗ |

| Create article | ✓ | ✓ | ✓ | ✗ |

| Edit any article | ✓ | ✓ | ✗ | ✗ |

| Edit own article | ✓ | ✓ | ✓ | ✗ |

| Publish / schedule article | ✓ | ✓ | ✗ | ✗ |

| Delete any article | ✓ | ✓ | ✗ | ✗ |

| Approve / reject comments | ✓ | ✓ | ✗ | ✗ |

| Manage users & assign roles | ✓ | ✗ | ✗ | ✗ |

| Manage categories | ✓ | ✗ | ✗ | ✗ |

| Manage ads | ✓ | ✗ | ✗ | ✗ |

| Review citizen submissions | ✓ | ✓ | ✗ | ✗ |

| View analytics dashboard | ✓ | ✓ | Limited | ✗ |

| Bookmark articles | ✓ | ✓ | ✓ | ✓ |

| Post comments | ✓ | ✓ | ✓ | ✓ |

| Register / sign in | ✓ | ✓ | ✓ | ✓ |



## API access



### Public (no session required)



| Endpoint | Notes |

|----------|-------|

| `GET /api/v1/articles` | **Published only** |

| `GET /api/v1/articles/:slug` | Published article by slug |

| `GET /api/v1/categories` | All categories |

| `GET /api/v1/categories/:slug/articles` | Published articles in category |

| `POST /api/v1/auth/register` | Creates account with `reader` role |

| `POST /api/v1/auth/login` | Credentials sign-in |

| `POST /api/v1/auth/forgot-password` | Password reset request |

| `POST /api/v1/auth/reset-password` | Set new password with token |

| `POST /api/v1/citizen/submit` | Citizen journalism story submission |



### Authenticated (any signed-in user)



| Endpoint | Notes |

|----------|-------|

| `POST /api/v1/auth/logout` | Sign out |

| `GET /api/v1/users/me` | Current user profile |

| `GET /api/v1/bookmarks` | User bookmarks |

| `POST /api/v1/bookmarks` | Save article bookmark |

| `DELETE /api/v1/bookmarks/:articleId` | Remove bookmark |

| `PATCH /api/v1/users/me` | Update profile |

| `GET /api/v1/users/:username` | Public profile |

| `GET /api/v1/feed` | Personalized feed (category follows + bookmarks) |

| `PUT /api/v1/feed` | Set category follow preferences |

| `GET /api/v1/articles/trending` | Trending articles by views |

| `GET /api/v1/articles/:slug/poll` | Article poll + vote state |

| `POST /api/v1/polls/:id` | Cast poll vote |

| `GET /api/v1/articles/:slug/live` | Live blog entries |

| `GET /api/v1/push/vapid-public-key` | Web Push VAPID public key |

| `POST /api/v1/push/subscribe` | Register push subscription |

| `DELETE /api/v1/push/subscribe` | Unregister push subscription |

| `GET /api/v1/notifications` | In-app notifications |

| `PATCH /api/v1/notifications` | Mark notification read |

| `DELETE /api/v1/comments/:id` | Delete own comment (or moderator) |



### Editorial dashboard (`requireEditorialSession`)



All `/api/v1/admin/*` routes require an editorial session (`admin`, `editor`, or `journalist`) unless noted.



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `GET /api/v1/admin/analytics` | journalist (limited) / editor / admin | Overview stats |

| `GET /api/v1/admin/articles` | journalist | Own articles only for journalists |

| `POST /api/v1/admin/articles` | journalist | Create draft |

| `GET /api/v1/admin/articles/:id` | journalist (own) / editor / admin | Fetch for editor |

| `PUT /api/v1/admin/articles/:id` | journalist (own) or editor/admin | Full update + ISR revalidate |

| `DELETE /api/v1/admin/articles/:id` | editor, admin | Delete article |

| `POST /api/v1/admin/upload` | journalist | Cloudinary image upload |



### Moderation (PRD §7)



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `GET /api/v1/admin/comments/pending` | editor, admin | Paginated moderation queue |

| `PUT /api/v1/comments/:id/approve` | editor, admin | Approve comment |

| `DELETE /api/v1/comments/:id` | owner or editor/admin | Remove comment |



### Users (PRD §7)



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `GET /api/v1/admin/users` | admin | List users (`?page`, `?limit`, `?role`, `?q`) |

| `PUT /api/v1/admin/users/:id/role` | admin | Assign role |



### Categories (PRD §8.5 Category Manager)



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `GET /api/v1/admin/categories` | admin | List with article counts |

| `POST /api/v1/admin/categories` | admin | Create category |

| `PUT /api/v1/admin/categories/:id` | admin | Update / reorder |

| `DELETE /api/v1/admin/categories/:id` | admin | Delete if no articles |



### Ads (PRD §7)



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `GET /api/v1/admin/ads` | admin | List all ads |

| `POST /api/v1/admin/ads` | admin | Create ad |

| `PUT /api/v1/admin/ads/:id` | admin | Update ad |



### Citizen journalism (PRD §7)



| Endpoint | Minimum role | Notes |

|----------|--------------|-------|

| `POST /api/v1/citizen/submit` | public | Submit story for review |

| `GET /api/v1/citizen/submissions` | admin | Full submission list (PRD) |

| `GET /api/v1/admin/citizen/submissions` | editor, admin | Review queue (default: pending) |

| `PUT /api/v1/admin/citizen/submissions/:id` | editor, admin | Set status: reviewed / approved / rejected |



### Cron



| Endpoint | Auth | Notes |

|----------|------|-------|

| `GET /api/v1/cron/publish-scheduled` | `Bearer $CRON_SECRET` | Publish due scheduled articles |



## Server-side auth helpers



```typescript

// Editorial session (dashboard roles)

import { requireEditorialSession, isEditorialSession } from "@/lib/api-auth";



// Role-gated admin routes

import { requireAdmin, requireModerator, parsePagination } from "@/lib/api-admin";



// RBAC checks

import { canModerateComments, canManageUsers } from "@/lib/rbac";

```



## Authentication stack



- **Auth.js v5** (`next-auth@beta`) with JWT sessions (PRD §11)

- **Prisma adapter** for OAuth account linking

- **Credentials** provider — bcrypt password verification

- **Rate limiting** — 5 attempts / 15 min on auth endpoints



## Seeded test accounts



After `npm run db:seed`, editorial users share **`Password123!`**:



| Email | Role |

|-------|------|

| `admin@orbitsphere.ng` | admin |

| `adaeze.okonkwo@orbitsphere.ng` | editor |

| `emeka.nwosu@orbitsphere.ng` | journalist |



Seed also includes pending comments and citizen submissions for moderation testing.



## Environment variables



```env

AUTH_SECRET=

AUTH_URL=http://localhost:3000

DATABASE_URL=

DIRECT_URL=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

CRON_SECRET=

# Web Push (VAPID) — generate with: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:newsroom@orbitsphere.ng
```



## Assigning roles



Only **admins** may change user roles via `PUT /api/v1/admin/users/:id/role`. Registration always creates `reader` accounts.


# OrbitSphere Design System

> PRD §9 — The Future of African Journalism  
> Version 1.0 · May 2026

This document defines the visual language, tokens, components, and accessibility standards for OrbitSphere. Implementation lives in `src/app/globals.css`, `src/lib/design-tokens.ts`, and `src/components/ui/`.

---

## 1. Design principles

- **Premium & cinematic** — Midnight blue foundation with gold accents; editorial serif headlines.
- **Mobile-first** — 60%+ of readers on smartphones; all layouts responsive.
- **Accessible by default** — WCAG 2.1 AA minimum; gold text uses contrast-safe variants.
- **Theme-aware** — Dark (default) and light modes via `next-themes`.

---

## 2. Color palette

### 2.1 Brand (constant)

| Token | Hex | Usage |
|-------|-----|-------|
| `midnight` | `#0A1931` | Brand identity, button text on gold |
| `gold-brand` | `#D4AF37` | Decorative borders, fills, large display |
| `gold-bg` | `#D4AF37` | Primary button background |
| `gold-fg` | `#0A1931` | Text/icons **on** gold buttons |
| `slate` | `#334756` | Secondary body (light mode) |
| `white` | `#FFFFFF` | Surfaces (light mode) |

### 2.2 Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `electric` | `#3B82F6` | Technology, links, AI features |
| `cyan` | `#06B6D4` | Education, secondary highlights |
| `breaking` | `#EF4444` | Breaking news ticker, alerts |
| `live` | `#22C55E` | Live badges, positive trends |

### 2.3 Semantic tokens (theme-aware)

CSS variables switch between `:root` (light) and `.dark`:

| Token | Dark | Light |
|-------|------|-------|
| `--ds-background` | `#0D1117` | `#F4F6F9` |
| `--ds-foreground` | `#F0F6FC` | `#0A1931` |
| `--ds-surface` | `#161B22` | `#FFFFFF` |
| `--ds-surface-2` | `#0E1F35` | `#EEF1F6` |
| `--ds-text-secondary` | `#8B949E` | `#334756` |
| `--ds-text-muted` | `#5E7080` | `#5E7080` |
| `--ds-gold` | `#E8C84A` | `#9A7B1A` |
| `--ds-border` | `rgba(212,175,55,0.18)` | `rgba(10,25,49,0.12)` |

Tailwind aliases: `bg-background`, `text-foreground`, `bg-surface`, `text-gold`, etc.

---

## 3. WCAG contrast — Gold & Midnight

Raw brand gold `#D4AF37` on midnight `#0A1931` is **~4.2:1** — insufficient for normal body text (AA requires **4.5:1**).

### Approved pairs (AA+)

| Foreground | Background | Ratio | Use |
|------------|------------|-------|-----|
| `#0A1931` (gold-fg) | `#D4AF37` (gold-bg) | ~8.5:1 | Primary buttons |
| `#E8C84A` (dark gold text) | `#0D1117` / `#0A1931` | ~5.4:1 | Links, labels, badges (dark mode) |
| `#9A7B1A` (light gold text) | `#FFFFFF` / `#F4F6F9` | ~5.8:1 | Links, labels (light mode) |
| `#F0F6FC` | `#0D1117` | ~15:1 | Body text (dark mode) |
| `#0A1931` | `#F4F6F9` | ~14:1 | Body text (light mode) |
| `#8B949E` | `#0D1117` | ~4.6:1 | Secondary text (dark mode) |
| `#334756` | `#FFFFFF` | ~7.5:1 | Secondary text (light mode) |

### Rules

1. Use `--ds-gold` (`text-gold`) for **text and links** — never raw `#D4AF37` for small copy.
2. Use `--color-gold-bg` + `--color-gold-fg` for **buttons** only.
3. Decorative gold borders and hero overlays may use `#D4AF37` at any size.
4. Breaking red and live green on dark surfaces pass AA for UI badges (large/bold text).

---

## 4. Typography

### 4.1 Font families

| Role | Family | CSS variable | Weight |
|------|--------|--------------|--------|
| Headlines (H1–H3) | Playfair Display | `--font-serif` | 700–900 |
| Sub-headlines / quotes | DM Serif Display | `--font-serif-alt` | 400 |
| Body | Inter | `--font-sans` | 400–500 |
| UI labels, nav, buttons | Poppins | `--font-ui` | 500–600 |

Loaded via `next/font/google` in `src/app/layout.tsx`.

### 4.2 Type scale

| Element | Desktop | Mobile | Line height |
|---------|---------|--------|-------------|
| H1 | 48px / 3rem | 32px / 2rem | 1.2 |
| H2 | 36px / 2.25rem | 26px / 1.625rem | 1.2 |
| H3 | 24px / 1.5rem | 20px / 1.25rem | 1.2 |
| Body | 16px / 1rem | 15px / 0.9375rem | 1.7 |
| Caption | 13px / 0.8125rem | — | 1.5 |
| Section label | 11px, uppercase, 0.18em tracking | — | — |

### 4.3 React components

```tsx
import { Heading, Text, Label, SectionTitle } from "@/components/ui";

<Heading level={1}>Page title</Heading>
<Text variant="body">Paragraph copy.</Text>
<Label>Breaking</Label>
<SectionTitle>Trending Now</SectionTitle>
```

Utility classes: `.section-label`, `.section-title`, `.font-serif`, `.font-ui`.

---

## 5. Theming (next-themes)

- **Provider:** `src/components/providers/ThemeProvider.tsx`
- **Storage key:** `orbitsphere-theme`
- **Default:** `dark`
- **Toggle:** `ThemeToggle` in navbar (sun/moon icon)
- **Mechanism:** `class="dark"` on `<html>`

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
setTheme("light"); // or "dark" | "system"
```

---

## 6. UI primitives

Import from `@/components/ui` or individual files.

| Component | File | Variants / notes |
|-----------|------|------------------|
| `Button` | `Button.tsx` | `primary`, `outline`, `ghost`; sizes `sm`, `md` |
| `Badge` | `Badge.tsx` | `gold`, `cyan`, `blue`, `breaking`, `live` |
| `CategoryBadge` | `Badge.tsx` | Optional `linked` prop |
| `Card` | `Card.tsx` | Hover lift, `padding` prop |
| `Input` | `Input.tsx` | Label, error state, focus ring |
| `Tag` | `Tag.tsx` | Pill tags for article topics |
| `Avatar` | `Avatar.tsx` | Initials circle |
| `Logo` | `Logo.tsx` | Orbit motif wordmark |
| `Skeleton` | `Skeleton.tsx` | Shimmer loading placeholder |
| `ThemeToggle` | `ThemeToggle.tsx` | Dark/light switch |
| `Heading`, `Text`, `Label` | `Typography.tsx` | Semantic type |

### Button spec (PRD §9.3)

- **Primary:** Gold background, midnight text, `rounded-full`
- **Outline:** Gold border, gold text, transparent fill
- **Ghost:** Surface fill, foreground text, subtle border
- **Focus:** 2px gold outline, 2px offset

### Card spec

- Radius: `12px` (`--radius-card`)
- Shadow: `--shadow-card`; hover `--shadow-card-hover`
- Hover: `translateY(-4px)` + deeper shadow (300ms ease)

---

## 7. Layout shells

| Shell | File | Used for |
|-------|------|----------|
| `PublicSiteShell` | `layout/PublicSiteShell.tsx` | Navbar + ticker + `<main>` + footer |
| `AdminShell` | `layout/AdminShell.tsx` | Sidebar + admin content |

Root layout wraps all pages:

```tsx
<ThemeProvider>
  <PublicSiteShell>{children}</PublicSiteShell>
</ThemeProvider>
```

Admin routes (`/admin/*`) skip public chrome automatically inside `PublicSiteShell`.

---

## 8. Spacing & layout

| Token | Value |
|-------|-------|
| Container max-width | 1380px (`.container-main`) |
| PRD wide breakpoint | 1440px |
| Card padding | 20px default |
| Section vertical rhythm | 60–70px |

### Breakpoints (PRD §9.5)

| Name | Width | Grid |
|------|-------|------|
| Mobile | < 640px | 1 column |
| Tablet | 640–1024px | 2 columns |
| Desktop | > 1024px | 3 columns |
| Wide | > 1280px | max-width container |

---

## 9. Motion

| Animation | Class / keyframe | Usage |
|-----------|------------------|-------|
| Fade up | `.fade-up` | Page sections |
| Ticker | `.ticker-inner` | Breaking news bar |
| Orbit spin | `.orbit-spin` | Logo ring |
| Shimmer | `@keyframes shimmer` | Skeleton loaders |
| Glow | `@keyframes glow` | Live badges |
| Card hover | `transition-all duration-300` | Article cards |

---

## 10. File reference

```
src/
├── app/globals.css              # CSS variables, @theme, base styles
├── lib/design-tokens.ts         # TS token constants
├── components/
│   ├── providers/ThemeProvider.tsx
│   ├── ui/                      # Primitives (Button, Card, …)
│   └── layout/
│       ├── PublicSiteShell.tsx
│       └── AdminShell.tsx
docs/
└── DESIGN_SYSTEM.md             # This file
```

---

## 11. Checklist for new UI

- [ ] Use semantic tokens (`text-foreground`, `bg-surface`) — not hardcoded `text-white`
- [ ] Gold **text** uses `text-gold` (accessible variant), not `#D4AF37`
- [ ] Buttons use `primary` variant (gold-bg + gold-fg)
- [ ] Focus states visible for keyboard users
- [ ] Images have `alt` text
- [ ] Test in both dark and light mode
- [ ] Verify contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

*OrbitSphere Media Limited · Design System v1.0*

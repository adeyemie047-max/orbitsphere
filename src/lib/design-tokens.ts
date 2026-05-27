/**
 * OrbitSphere design tokens (PRD §9).
 * WCAG 2.1 AA contrast pairs documented in docs/DESIGN_SYSTEM.md
 */

export const colors = {
  midnight: "#0A1931",
  midnightDeep: "#060E1F",
  gold: "#D4AF37",
  goldLight: "#E8C84A",
  goldAccessibleDark: "#E8C84A",
  goldAccessibleLight: "#9A7B1A",
  goldForeground: "#0A1931",
  white: "#FFFFFF",
  slate: "#334756",
  electric: "#3B82F6",
  cyan: "#06B6D4",
  breaking: "#EF4444",
  live: "#22C55E",
  dark: {
    background: "#0D1117",
    surface: "#161B22",
    border: "#30363D",
    textPrimary: "#F0F6FC",
    textSecondary: "#8B949E",
  },
  light: {
    background: "#F4F6F9",
    surface: "#FFFFFF",
    surface2: "#EEF1F6",
    border: "rgba(10, 25, 49, 0.12)",
    textPrimary: "#0A1931",
    textSecondary: "#334756",
    textMuted: "#5E7080",
  },
} as const;

export const typography = {
  fontSerif: "var(--font-serif)",
  fontSerifAlt: "var(--font-serif-alt)",
  fontSans: "var(--font-sans)",
  fontUi: "var(--font-ui)",
  scale: {
    h1: { desktop: "3rem", mobile: "2rem", lineHeight: "1.2", weight: 700 },
    h2: { desktop: "2.25rem", mobile: "1.625rem", lineHeight: "1.2", weight: 700 },
    h3: { desktop: "1.5rem", mobile: "1.25rem", lineHeight: "1.2", weight: 700 },
    body: { desktop: "1rem", mobile: "0.9375rem", lineHeight: "1.7", weight: 400 },
    caption: { size: "0.8125rem", lineHeight: "1.5", weight: 500 },
    label: { size: "0.6875rem", lineHeight: "1.4", weight: 600, letterSpacing: "0.18em" },
  },
} as const;

export const radii = {
  card: "12px",
  sm: "8px",
  full: "9999px",
} as const;

export const shadows = {
  card: "0 4px 20px rgba(0, 0, 0, 0.08)",
  cardHover: "0 8px 32px rgba(0, 0, 0, 0.12)",
  cardDark: "0 8px 32px rgba(0, 0, 0, 0.45)",
} as const;

export const breakpoints = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  wide: 1440,
} as const;

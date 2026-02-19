/**
 * Per-route SEO meta: title and description.
 * Used for document.title and meta name="description", og:title, og:description, og:url.
 */
export const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "BYU Product Management Association",
    description:
      "Empowering the next generation of product leaders through hands-on experience, industry connections, and community at Brigham Young University.",
  },
  "/team": {
    title: "Team | BYU PMA",
    description: "Meet the BYU Product Management Association leadership and team.",
  },
  "/hackathon": {
    title: "AI Product Hackathon | BYU PMA",
    description:
      "BYU × Utah PMA AI Product Hackathon. Build, learn, and compete with product and tech.",
  },
  "/hackathon/share": {
    title: "Share the Hackathon | BYU PMA",
    description: "Share the BYU × Utah PMA AI Product Hackathon with your network.",
  },
  "/hackathon/faq": {
    title: "Hackathon FAQ | BYU PMA",
    description: "Frequently asked questions about the BYU × Utah PMA AI Product Hackathon.",
  },
  "/events": {
    title: "Events | BYU PMA",
    description: "Upcoming events, workshops, and meetings from the BYU Product Management Association.",
  },
  "/resources": {
    title: "Resources | BYU PMA",
    description: "Product management resources, guides, and tools from BYU PMA.",
  },
  "/contact": {
    title: "Contact | BYU PMA",
    description: "Get in touch with the BYU Product Management Association.",
  },
  "/discover": {
    title: "Discover PM | BYU PMA",
    description: "Discover product management paths and opportunities with BYU PMA.",
  },
  "/game": {
    title: "Game | BYU PMA",
    description: "BYU PMA game and engagement.",
  },
  "/auth": {
    title: "Sign In | BYU PMA",
    description: "Sign in or create an account with BYU PMA.",
  },
  "/dashboard": {
    title: "Dashboard | BYU PMA",
    description: "Your BYU PMA dashboard and profile.",
  },
};

const DEFAULT_META = ROUTE_META["/"];

/** Get meta for path; uses exact match or fallback to default (e.g. 404). */
export function getMetaForPath(pathname: string): { title: string; description: string } {
  return ROUTE_META[pathname] ?? DEFAULT_META;
}

/** Canonical base URL for OG and sitemap (no trailing slash). */
export function getCanonicalBase(): string {
  if (import.meta.env.VITE_SITE_URL) {
    return String(import.meta.env.VITE_SITE_URL).replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://pma-website-bay.vercel.app";
}

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
  "/profile": {
    title: "Profile | BYU PMA",
    description: "Your BYU PMA profile and account details.",
  },
  "/blocked": {
    title: "Access Restricted | BYU PMA",
    description: "This account’s access has been restricted by an administrator.",
  },
  "/admin": {
    title: "Admin Dashboard | BYU PMA",
    description: "Administrative dashboard for managing PMA access and content.",
  },
  "/admin/access": {
    title: "Access & Membership | BYU PMA",
    description: "Manage users, roles, and pre-approved BYU emails for PMA.",
  },
  "/admin/team": {
    title: "Admin Team | BYU PMA",
    description: "Manage PMA Presidency team members shown on the website.",
  },
  "/admin/events": {
    title: "Admin Events | BYU PMA",
    description: "Manage PMA events shown on the website.",
  },
  "/admin/resources": {
    title: "Admin Resources | BYU PMA",
    description: "Manage tools and resources shown on the Resources page.",
  },
  "/preferences": {
    title: "Job Preferences | BYU PMA",
    description: "Manage your career and job preferences.",
  },
  "/jobs": {
    title: "Jobs | BYU PMA",
    description: "Explore product management job opportunities.",
  },
  "/roadmap": {
    title: "Career Roadmap | BYU PMA",
    description: "Your personalized product management career roadmap.",
  },
  "/members": {
    title: "Members Directory | BYU PMA",
    description: "Connect with BYU PMA members and alumni.",
  },
  "/tracker": {
    title: "Application Tracker | BYU PMA",
    description: "Track your product management job applications.",
  },
  "/interviews": {
    title: "Mock Interviews | BYU PMA",
    description: "Practice your PM interview skills with peers.",
  },
  "/resumes": {
    title: "Resume Review | BYU PMA",
    description: "Upload your resume for asynchronous feedback.",
  },
  "/admin/jobs": {
    title: "Admin Jobs | BYU PMA",
    description: "Manage job postings and notify matching candidates.",
  },
  "/admin/resumes": {
    title: "Admin Resumes | BYU PMA",
    description: "Review member resumes and provide actionable feedback.",
  },
};

/** Meta for 404 (unknown paths). Used for document.title and og/twitter when route is not found. */
export const NOT_FOUND_META = {
  title: "Page Not Found | BYU PMA",
  description:
    "The page you're looking for doesn't exist or may have been moved. Return to BYU Product Management Association.",
};

/** Get meta for path; exact match for known routes, NOT_FOUND_META for unknown (404). */
export function getMetaForPath(pathname: string): { title: string; description: string } {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
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

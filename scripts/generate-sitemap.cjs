/**
 * Build-time script: generates public/sitemap.xml and public/robots.txt
 * using VITE_SITE_URL (no trailing slash). Run before `vite build` (e.g. prebuild).
 */
const fs = require("fs");
const path = require("path");

const baseUrl = (process.env.VITE_SITE_URL || "https://pma-website-bay.vercel.app").replace(/\/$/, "");
const publicDir = path.join(__dirname, "..", "public");

const routes = [
  "/",
  "/team",
  "/hackathon",
  "/hackathon/share",
  "/hackathon/faq",
  "/events",
  "/resources",
  "/contact",
  "/discover",
  "/game",
];

const lastmod = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route === "/" ? "" : route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");
console.log("Generated public/sitemap.xml and public/robots.txt with base URL:", baseUrl);

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMetaForPath, getCanonicalBase } from "@/lib/routeMeta";

const OG_IMAGE_PATH = "/img/pma-logo.png";

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Updates document.title and meta tags (description, og:*, twitter:*) on route change.
 * Uses VITE_SITE_URL for canonical og:url when set.
 */
export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = getMetaForPath(pathname);
    const base = getCanonicalBase();
    const canonicalUrl = pathname === "/" ? base : `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    const imageUrl = base.startsWith("http") ? `${base}${OG_IMAGE_PATH}` : `${window.location.origin}${OG_IMAGE_PATH}`;

    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", imageUrl, "property");
    setMeta("twitter:title", title, "property");
    setMeta("twitter:description", description, "property");
    setMeta("twitter:image", imageUrl, "property");
  }, [pathname]);

  return null;
}

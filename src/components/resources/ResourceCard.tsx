import { useState } from "react";
import { Crown, ExternalLink, Lock, Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isInAppGuide, resourceAnchorId, type Category, type Resource } from "@/lib/resourceCatalog";

const getDomain = (urlString: string) => {
  try {
    return new URL(urlString).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
};

const getYouTubeId = (urlString: string) => {
  try {
    const url = new URL(urlString);
    const host = url.hostname.replace(/^(www|m)\./, "");
    if (host === "youtu.be") return url.pathname.split("/")[1] || null;
    if (host === "youtube.com" && url.pathname === "/watch") return url.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
};

type ImageSource = { src: string; kind: "cover" | "video" | "favicon" };

export const ResourceImage = ({ resource, isPmaMember }: { resource: Resource; isPmaMember: boolean }) => {
  const [sourceIndex, setSourceIndex] = useState(0);

  const sources: ImageSource[] = [];
  if (resource.image && (resource.image.startsWith("http") || resource.image.startsWith("/assets/"))) {
    sources.push({ src: resource.image, kind: "cover" });
  }
  const youTubeId = getYouTubeId(resource.url);
  if (youTubeId) {
    sources.push({ src: `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`, kind: "video" });
  }
  const domain = getDomain(resource.url);
  if (domain) {
    sources.push({ src: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`, kind: "favicon" });
  }

  const current = sources[sourceIndex];
  const premiumOpacity = resource.isPremium && !isPmaMember ? "opacity-60" : "";
  const handleError = () => setSourceIndex((i) => i + 1);

  if (!current) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary/40 font-bold ${premiumOpacity}`}>
        <span className="text-4xl">{resource.title.charAt(0)}</span>
      </div>
    );
  }

  if (current.kind === "favicon") {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-white dark:bg-muted p-6 ${premiumOpacity}`}>
        <img src={current.src} alt={resource.title} loading="lazy" className="w-16 h-16 object-contain" onError={handleError} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={current.src}
        alt={resource.title}
        loading="lazy"
        className={`w-full h-full object-cover ${premiumOpacity}`}
        onError={handleError}
      />
      {current.kind === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export const ResourceBadges = ({ resource, isPmaMember }: { resource: Resource; isPmaMember: boolean }) => (
  <>
    {resource.isPremium && !isPmaMember && (
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <Lock className="w-5 h-5 text-white" />
      </div>
    )}
    {resource.isPaid && (
      <Badge className="absolute top-2 right-2 text-xs px-2 py-0.5">
        <Star className="w-3 h-3 mr-1 fill-current" />
        Partner
      </Badge>
    )}
    {resource.isPremium && (
      <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground hover:bg-accent/80 text-xs px-2 py-0.5">
        <Crown className="w-3 h-3 mr-1 fill-current" />
        Premium
      </Badge>
    )}
  </>
);

interface ResourceCardProps {
  resource: Resource;
  category: Category;
  isPmaMember: boolean;
  showCategory?: boolean;
  onOpen: (resource: Resource, categoryId: string, e?: React.MouseEvent) => Promise<void>;
}

const ResourceCard = ({ resource, category, isPmaMember, showCategory, onOpen }: ResourceCardProps) => {
  const isGuide = isInAppGuide(resource);
  const ListTag = isGuide ? "ol" : "ul";

  return (
    <Card
      id={resourceAnchorId(resource.title)}
      className={`h-full flex flex-col overflow-hidden bg-card border-border scroll-mt-24 ${resource.isPremium && !isPmaMember ? "ring-1 ring-accent/40" : ""}`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        <ResourceImage resource={resource} isPmaMember={isPmaMember} />
        <ResourceBadges resource={resource} isPmaMember={isPmaMember} />
      </div>
      <CardContent className="flex flex-col flex-1 p-5">
        {showCategory && (
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-5 h-5 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}>
              <div className="scale-[0.6]">
                <category.Icon className="w-6 h-6" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{category.title}</span>
          </div>
        )}
        <h3 className="text-lg font-semibold leading-snug text-card-foreground mb-2">{resource.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">{resource.description}</p>

        {resource.tips && (
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-foreground mb-2">{isGuide ? "How to do it" : "Tips"}</h4>
            <ListTag className={`${isGuide ? "list-decimal" : "list-disc"} pl-5 space-y-1.5`}>
              {resource.tips.map((tip, tipIdx) => (
                <li key={tipIdx} className="text-sm leading-relaxed text-foreground/90">
                  {tip}
                </li>
              ))}
            </ListTag>
          </div>
        )}

        {!isGuide && (
          <Button asChild className="mt-auto w-full">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${resource.title}`}
              onClick={(e) => void onOpen(resource, category.id, e)}
            >
              Open
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceCard;

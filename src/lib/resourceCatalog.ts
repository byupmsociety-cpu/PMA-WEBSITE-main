import { BookOpen, Briefcase, Cpu, Users, Video, type LucideIcon } from "lucide-react";
import { RESOURCE_CATEGORIES, type ResourceIcon } from "@/lib/resources";

export interface Resource {
  title: string;
  description: string;
  url: string;
  image: string;
  tips?: string[];
  isPaid?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  color: string;
  resources: Resource[];
}

const ICON_MAP: Record<ResourceIcon, LucideIcon> = { BookOpen, Video, Briefcase, Users, Cpu };

export const CATEGORIES: Category[] = RESOURCE_CATEGORIES.map((category) => ({
  id: category.slug,
  title: category.title,
  description: category.description,
  Icon: ICON_MAP[category.icon],
  color: category.color,
  resources: category.resources.map((resource) => ({
    title: resource.title,
    description: resource.description,
    url: resource.url,
    image: resource.imageUrl ?? "",
    tips: resource.tips.length > 0 ? resource.tips : undefined,
    isPaid: resource.isPaid,
    isFeatured: resource.isFeatured,
  })),
}));

export const NON_EMPTY_CATEGORIES = CATEGORIES.filter((category) => category.resources.length > 0);

export const findResource = (title: string): { resource: Resource; category: Category } | null => {
  for (const category of CATEGORIES) {
    const resource = category.resources.find((r) => r.title === title);
    if (resource) return { resource, category };
  }
  return null;
};

export const resourceAnchorId = (title: string) => `resource-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const isInAppGuide = (resource: Resource) => {
  const url = resource.url?.trim() ?? "";
  return url === "" || url === "#";
};

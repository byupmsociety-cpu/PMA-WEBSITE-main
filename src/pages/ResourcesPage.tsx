import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Linkedin, Building2, Coffee, Briefcase, Cpu, ArrowLeft, Search, TrendingUp, Star, GraduationCap, BookOpen, Users, Lightbulb, Lock, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import PaidResourceModal from "@/components/PaidResourceModal";
import PremiumResourceModal from "@/components/PremiumResourceModal";

interface DbResourceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
}

interface DbResource {
  id: string;
  category_id: string;
  subcategory: string | null;
  title: string;
  description: string;
  url: string;
  image_url: string;
  tips: string[] | null;
  is_paid: boolean;
  is_premium: boolean;
  is_featured: boolean;
  display_order: number;
}

interface Resource {
  title: string;
  description: string;
  url: string;
  image: string;
  tips?: string[];
  isPaid?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
}

interface Subcategory {
  id: string;
  title: string;
  resources: Resource[];
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resources?: Resource[];
  subcategories?: Subcategory[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Linkedin: <Linkedin className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
};

const ResourceImage = ({ resource, isPmaMember }: { resource: Resource; isPmaMember: boolean }) => {
  const [sourceIndex, setSourceIndex] = useState(0);

  const getDomain = (urlString: string) => {
    try { return new URL(urlString).hostname.replace('www.', ''); } catch (e) { return null; }
  };
  const domain = getDomain(resource.url);

  const sources = [];
  if (resource.image && resource.image.startsWith('http')) {
    sources.push(resource.image);
  }
  if (resource.image && resource.image.startsWith('/assets/')) {
    sources.push(resource.image);
  }
  if (domain) {
    sources.push(`https://logo.clearbit.com/${domain}?size=240`);
  }

  const currentSrc = sources[sourceIndex];
  const premiumOpacity = resource.isPremium && !isPmaMember ? 'opacity-60' : '';

  if (!currentSrc || sourceIndex >= sources.length) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary/40 font-bold ${premiumOpacity}`}>
        <span className="text-4xl">{resource.title.charAt(0)}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={resource.title}
      className={`w-full h-full transition-opacity ${currentSrc.includes('clearbit') ? 'object-contain p-6 bg-white dark:bg-zinc-900' : 'object-cover'} ${premiumOpacity}`}
      onError={() => setSourceIndex(i => i + 1)}
    />
  );
};

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [topResources, setTopResources] = useState<Array<{ resource: Resource; category: Category; clicks: number }>>(
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const [isPmaMember, setIsPmaMember] = useState(false);
  const [selectedPaidResource, setSelectedPaidResource] = useState<{ title: string; url: string } | null>(null);
  const [selectedPremiumResource, setSelectedPremiumResource] = useState<{ title: string; url: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
    void loadResourcesData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setTimeout(() => {
        if (session?.user) {
          fetchMembershipStatus(session.user.id);
        } else {
          setIsPmaMember(false);
        }
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMembershipStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const resourceParam = searchParams.get("resource");
    if (resourceParam && categories.length > 0) {
      let matchedResource: Resource | undefined;

      for (const cat of categories) {
        matchedResource = cat.resources?.find(r => r.title === resourceParam);
        if (matchedResource) break;

        if (cat.subcategories) {
          for (const sub of cat.subcategories) {
            matchedResource = sub.resources.find(r => r.title === resourceParam);
            if (matchedResource) break;
          }
        }
        if (matchedResource) break;
      }

      if (matchedResource?.isPaid) {
        setSelectedPaidResource({ title: matchedResource.title, url: matchedResource.url });
      }
      setSearchParams({});
    }
  }, [searchParams, categories, setSearchParams]);

  const loadResourcesData = async () => {
    setLoadingData(true);

    const [categoriesResult, resourcesResult] = await Promise.all([
      supabase
        .from("resource_categories")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("resources")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    if (categoriesResult.error) {
      console.error("Error loading categories", categoriesResult.error);
      setLoadingData(false);
      return;
    }

    if (resourcesResult.error) {
      console.error("Error loading resources", resourcesResult.error);
      setLoadingData(false);
      return;
    }

    const dbCategories: DbResourceCategory[] = (categoriesResult.data as any) ?? [];
    const dbResources: DbResource[] = (resourcesResult.data as any) ?? [];

    const transformedCategories: Category[] = dbCategories.map((dbCat) => {
      const categoryResources = dbResources.filter((r) => r.category_id === dbCat.id);

      const subcategoryNames = [...new Set(
        categoryResources
          .filter((r) => r.subcategory)
          .map((r) => r.subcategory!)
      )];

      const hasSubcategories = subcategoryNames.length > 0;

      const mapResource = (r: DbResource): Resource => ({
        title: r.title,
        description: r.description,
        url: r.url,
        image: r.image_url,
        tips: r.tips && r.tips.length > 0 ? r.tips : undefined,
        isPaid: r.is_paid || undefined,
        isPremium: r.is_premium || undefined,
        isFeatured: r.is_featured || undefined,
      });

      if (hasSubcategories) {
        const subcategories: Subcategory[] = subcategoryNames.map((subName) => ({
          id: subName.toLowerCase().replace(/\s+/g, "-"),
          title: subName,
          resources: categoryResources
            .filter((r) => r.subcategory === subName)
            .map(mapResource),
        }));

        const directResources = categoryResources
          .filter((r) => !r.subcategory)
          .map(mapResource);

        return {
          id: dbCat.slug,
          title: dbCat.title,
          description: dbCat.description,
          icon: ICON_MAP[dbCat.icon] ?? <FileText className="w-6 h-6" />,
          color: dbCat.color,
          subcategories,
          resources: directResources.length > 0 ? directResources : undefined,
        };
      } else {
        return {
          id: dbCat.slug,
          title: dbCat.title,
          description: dbCat.description,
          icon: ICON_MAP[dbCat.icon] ?? <FileText className="w-6 h-6" />,
          color: dbCat.color,
          resources: categoryResources.map(mapResource),
        };
      }
    });

    setCategories(transformedCategories);

    const finalResources: Array<{ resource: Resource; category: Category; clicks: number }> = [];

    transformedCategories.forEach((category) => {
      category.resources?.forEach((resource) => {
        if (resource.isFeatured) {
          finalResources.push({ resource, category, clicks: 0 });
        }
      });
      category.subcategories?.forEach((subcategory) => {
        subcategory.resources.forEach((resource) => {
          if (resource.isFeatured) {
            finalResources.push({ resource, category, clicks: 0 });
          }
        });
      });
    });

    setTopResources(finalResources);
    setLoadingData(false);
  };

  const fetchMembershipStatus = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pma_member")
      .eq("user_id", userId)
      .single();

    setIsPmaMember(profile?.is_pma_member ?? false);
  };

  const trackResourceClick = async (resource: Resource, categoryId: string, e?: React.MouseEvent) => {
    if (resource.isPaid) {
      e?.preventDefault();
      setSelectedPaidResource({ title: resource.title, url: resource.url });
      return;
    }

    if (resource.isPremium && !isPmaMember) {
      e?.preventDefault();
      setSelectedPremiumResource({ title: resource.title, url: resource.url });
      return;
    }

    await supabase.from("resource_clicks").insert({
      resource_title: resource.title,
      category_id: categoryId,
    });
  };

  const searchResults = searchQuery
    ? categories.flatMap((category) => {
      const results: Array<{ resource: Resource; category: Category }> = [];

      category.resources?.forEach((resource) => {
        if (
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ resource, category });
        }
      });

      category.subcategories?.forEach((subcategory) => {
        subcategory.resources.forEach((resource) => {
          if (
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            results.push({ resource, category });
          }
        });
      });

      return results;
    })
    : [];

  const filteredCategories = categories.filter((category) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const titleMatch = category.title.toLowerCase().includes(query);
    const descMatch = category.description.toLowerCase().includes(query);

    const resourceMatch = category.resources?.some(
      (resource) =>
        resource.title.toLowerCase().includes(query) || resource.description.toLowerCase().includes(query),
    ) || false;

    const subcategoryMatch = category.subcategories?.some((subcategory) =>
      subcategory.resources.some(
        (resource) =>
          resource.title.toLowerCase().includes(query) || resource.description.toLowerCase().includes(query),
      ),
    ) || false;

    return titleMatch || descMatch || resourceMatch || subcategoryMatch;
  });

  const selectedCategoryData = selectedCategory ? categories.find((c) => c.id === selectedCategory) : null;

  if (loadingData) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background text-foreground overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 max-w-full">
        <AnimatedSection animation="slide-up">
          <div className="w-full max-w-3xl mx-auto text-center mb-8 px-2 md:px-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
              PM{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent break-words">
                Content Library
              </span>
            </h1>
            <p className="text-base text-muted-foreground mb-6">
              Everything you need to excel in your product management journey
            </p>

            {!selectedCategory && (
              <div className="relative w-full max-w-xl mx-auto px-4 md:px-0">
                <Search className="absolute left-7 md:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base w-full max-w-full"
                />
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Most Useful Resources Carousel */}
        {!selectedCategory && !searchQuery && topResources.length > 0 && (
          <AnimatedSection animation="fade-in">
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold">Most Useful Resources</h2>
              </div>
              <div className="overflow-hidden">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {topResources.map(({ resource, category }, idx) => (
                    <CarouselItem key={idx} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                      <Card
                        className={`h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${resource.isPremium && !isPmaMember ? 'ring-1 ring-amber-500/30' : ''}`}
                        onClick={(e) => {
                          if (resource.isPaid) {
                            e.preventDefault();
                            setSelectedPaidResource({ title: resource.title, url: resource.url });
                          } else if (resource.isPremium && !isPmaMember) {
                            e.preventDefault();
                            setSelectedPremiumResource({ title: resource.title, url: resource.url });
                          } else {
                            trackResourceClick(resource, category.id);
                            window.open(resource.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center gap-1 mb-1.5">
                            <div
                              className={`w-4 h-4 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}
                            >
                              <div className="scale-75">{category.icon}</div>
                            </div>
                            <span className="text-[8px] text-muted-foreground line-clamp-1">{category.title}</span>
                          </div>

                          <div className="mb-1.5">
                            <div className="w-full aspect-video sm:aspect-square rounded-md overflow-hidden bg-muted mb-1.5 relative">
                              <ResourceImage resource={resource} isPmaMember={isPmaMember} />
                              {resource.isPremium && !isPmaMember && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Lock className="w-4 h-4 text-white" />
                                </div>
                              )}
                              {resource.isPaid && (
                                <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                                  <Star className="w-2 h-2 mr-0.5 fill-current" />
                                  Partner
                                </Badge>
                              )}
                              {resource.isPremium && (
                                <Badge className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] px-1 py-0">
                                  <Crown className="w-2 h-2 mr-0.5 fill-current" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-[10px] font-semibold mb-0.5 text-card-foreground line-clamp-2">
                              {resource.title}
                            </h3>
                            <p className="text-[9px] text-muted-foreground line-clamp-2">
                              {resource.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              </div>
            </div>
          </AnimatedSection>
        )}

        {selectedCategory ? (
          // Detail View
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to all categories
            </button>

            {selectedCategoryData && (
              <AnimatedSection animation="fade-in">
                <div className="mb-8">
                  <div
                    className={`inline-flex items-center gap-3 bg-gradient-to-r ${selectedCategoryData.color} p-4 rounded-lg text-white mb-4`}
                  >
                    {selectedCategoryData.icon}
                    <h2 className="text-2xl font-bold">{selectedCategoryData.title}</h2>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedCategoryData.description}</p>
                </div>

                {selectedCategoryData.subcategories ? (
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Sticky Sidebar for Desktop / Top Menu for Mobile */}
                    <div className="md:w-64 shrink-0">
                      <div className="sticky top-24 space-y-2 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h3>
                        <div className="flex overflow-x-auto md:flex-col gap-2 no-scrollbar pb-2 md:pb-0">
                          {selectedCategoryData.subcategories.map((sub, idx) => (
                            <a
                              key={idx}
                              href={`#sub-${sub.id}`}
                              className="block whitespace-nowrap px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors"
                            >
                              {sub.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="flex-1 space-y-12">
                      {selectedCategoryData.subcategories.map((subcategory, subIdx) => (
                        <div key={subIdx} id={`sub-${subcategory.id}`} className="scroll-mt-32">
                          <h3 className="text-2xl font-bold mb-6 pb-2 border-b border-border text-foreground/90">{subcategory.title}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                            {subcategory.resources.map((resource, idx) => (
                              <AnimatedSection key={idx} animation="slide-up" delay={idx * 50}>
                                <Card
                                  className={`h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${resource.isPremium && !isPmaMember ? 'ring-1 ring-amber-500/30' : ''}`}
                                  onClick={(e) => {
                                    if (resource.isPaid) {
                                      e.preventDefault();
                                      setSelectedPaidResource({ title: resource.title, url: resource.url });
                                    } else if (resource.isPremium && !isPmaMember) {
                                      e.preventDefault();
                                      setSelectedPremiumResource({ title: resource.title, url: resource.url });
                                    } else {
                                      trackResourceClick(resource, selectedCategoryData.id);
                                      window.open(resource.url, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <CardContent className="p-3">
                                    <div className="mb-2">
                                      <div className="w-full aspect-square rounded-md overflow-hidden bg-muted mb-2 relative">
                                        <ResourceImage resource={resource} isPmaMember={isPmaMember} />
                                        {resource.isPremium && !isPmaMember && (
                                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-white" />
                                          </div>
                                        )}
                                        {resource.isPaid && (
                                          <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[9px] px-1.5 py-0.5">
                                            <Star className="w-2.5 h-2.5 mr-1 fill-current" />
                                            Partner
                                          </Badge>
                                        )}
                                        {resource.isPremium && (
                                          <Badge className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] px-1.5 py-0.5">
                                            <Crown className="w-2.5 h-2.5 mr-1 fill-current" />
                                            Premium
                                          </Badge>
                                        )}
                                      </div>
                                      <h3 className="text-xs sm:text-sm font-semibold mb-1 text-card-foreground line-clamp-2 leading-tight">
                                        {resource.title}
                                      </h3>
                                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">{resource.description}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </AnimatedSection>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Regular grid view for other categories
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                    {selectedCategoryData.resources?.map((resource, idx) => (
                      <AnimatedSection key={idx} animation="slide-up" delay={idx * 100}>
                        <Card
                          className={`h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${resource.isPremium && !isPmaMember ? 'ring-1 ring-amber-500/30' : ''}`}
                          onClick={(e) => {
                            if (resource.isPaid) {
                              e.preventDefault();
                              setSelectedPaidResource({ title: resource.title, url: resource.url });
                            } else if (resource.isPremium && !isPmaMember) {
                              e.preventDefault();
                              setSelectedPremiumResource({ title: resource.title, url: resource.url });
                            } else {
                              selectedCategoryData && trackResourceClick(resource, selectedCategoryData.id);
                              window.open(resource.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <CardContent className="p-2">
                            <div className="mb-1.5">
                              <div className="w-full aspect-square rounded-md overflow-hidden bg-muted mb-1.5 relative">
                                <ResourceImage resource={resource} isPmaMember={isPmaMember} />
                                {resource.isPremium && !isPmaMember && (
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <Lock className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                {resource.isPaid && (
                                  <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                                    <Star className="w-2 h-2 mr-0.5 fill-current" />
                                    Partner
                                  </Badge>
                                )}
                                {resource.isPremium && (
                                  <Badge className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] px-1 py-0">
                                    <Crown className="w-2 h-2 mr-0.5 fill-current" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-[10px] font-semibold mb-0.5 text-card-foreground line-clamp-2">
                                {resource.title}
                              </h3>
                              <p className="text-[9px] text-muted-foreground line-clamp-2">{resource.description}</p>
                            </div>

                            {resource.tips && (
                              <div className="mb-1.5 p-1.5 bg-muted/50 rounded-md">
                                <h4 className="text-[9px] font-semibold mb-0.5 text-foreground">Tips:</h4>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {resource.tips.slice(0, 1).map((tip, tipIdx) => (
                                    <li
                                      key={tipIdx}
                                      className="text-[8px] leading-tight text-muted-foreground line-clamp-1"
                                    >
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    ))}
                  </div>
                )}
              </AnimatedSection>
            )}
          </div>
        ) : searchQuery && searchResults.length > 0 ? (
          // Search Results View
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">
              Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {searchResults.map(({ resource, category }, idx) => (
                <AnimatedSection key={idx} animation="slide-up" delay={idx * 50}>
                  <Card
                    className={`h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${resource.isPremium && !isPmaMember ? 'ring-1 ring-amber-500/30' : ''}`}
                    onClick={(e) => {
                      if (resource.isPaid) {
                        e.preventDefault();
                        setSelectedPaidResource({ title: resource.title, url: resource.url });
                      } else if (resource.isPremium && !isPmaMember) {
                        e.preventDefault();
                        setSelectedPremiumResource({ title: resource.title, url: resource.url });
                      } else {
                        trackResourceClick(resource, category.id);
                        window.open(resource.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center gap-1 mb-1.5">
                        <div
                          className={`w-4 h-4 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}
                        >
                          <div className="scale-75">{category.icon}</div>
                        </div>
                        <span className="text-[8px] text-muted-foreground line-clamp-1">{category.title}</span>
                      </div>

                      <div className="mb-1.5">
                        <div className="w-full aspect-square rounded-md overflow-hidden bg-muted mb-1.5 relative">
                          <ResourceImage resource={resource} isPmaMember={isPmaMember} />
                          {resource.isPremium && !isPmaMember && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {resource.isPaid && (
                            <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                              <Star className="w-2 h-2 mr-0.5 fill-current" />
                              Partner
                            </Badge>
                          )}
                          {resource.isPremium && (
                            <Badge className="absolute top-1 left-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] px-1 py-0">
                              <Crown className="w-2 h-2 mr-0.5 fill-current" />
                              Premium
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-[10px] font-semibold mb-0.5 text-card-foreground line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-[9px] text-muted-foreground line-clamp-2">{resource.description}</p>
                      </div>

                      {resource.tips && (
                        <div className="mb-1.5 p-1.5 bg-muted/50 rounded-md">
                          <h4 className="text-[9px] font-semibold mb-0.5 text-foreground">Tips:</h4>
                          <ul className="list-disc list-inside space-y-0.5">
                            {resource.tips.slice(0, 1).map((tip, tipIdx) => (
                              <li key={tipIdx} className="text-[8px] leading-tight text-muted-foreground line-clamp-1">
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          // No Results
          <div className="max-w-6xl mx-auto text-center py-12">
            <p className="text-muted-foreground">No resources found matching "{searchQuery}"</p>
          </div>
        ) : (
          // Category Grid View
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((category, idx) => (
              <AnimatedSection key={category.id} animation="slide-up" delay={idx * 100}>
                <Card
                  className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-5">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors truncate">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category.resources?.length ||
                          category.subcategories?.reduce((acc, sub) => acc + sub.resources.length, 0) ||
                          0} resources
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>

      {/* Paid Resource Modal */}
      <PaidResourceModal
        isOpen={!!selectedPaidResource}
        onClose={() => setSelectedPaidResource(null)}
        resourceTitle={selectedPaidResource?.title || ""}
        resourceUrl={selectedPaidResource?.url || ""}
        isAuthenticated={!!user}
        isPmaMember={isPmaMember}
      />

      {/* Premium Resource Modal */}
      <PremiumResourceModal
        isOpen={!!selectedPremiumResource}
        onClose={() => setSelectedPremiumResource(null)}
        resourceTitle={selectedPremiumResource?.title || ""}
        resourceUrl={selectedPremiumResource?.url || ""}
        isAuthenticated={!!user}
        isPmaMember={isPmaMember}
      />
    </div>
  );
};

export default ResourcesPage;

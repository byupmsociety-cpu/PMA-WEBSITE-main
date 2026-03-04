import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Linkedin, Building2, Coffee, Briefcase, Cpu, ArrowLeft, Search, TrendingUp, Star, GraduationCap, BookOpen, Users, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import PaidResourceModal from "@/components/PaidResourceModal";

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
  tips: string[];
  is_paid: boolean;
  display_order: number;
}

interface Resource {
  title: string;
  description: string;
  url: string;
  image: string;
  tips?: string[];
  isPaid?: boolean;
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

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [topResources, setTopResources] = useState<Array<{ resource: Resource; category: Category; clicks: number }>>(
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const [isPmaMember, setIsPmaMember] = useState(false);
  const [selectedPaidResource, setSelectedPaidResource] = useState<{ title: string; url: string } | null>(null);
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

    const dbCategories: DbResourceCategory[] = categoriesResult.data ?? [];
    const dbResources: DbResource[] = resourcesResult.data ?? [];

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
    
    const defaultResourceTitles = ["PMF Labs", "Lovable.dev", "Leland+", "Cursor", "APM Season", "Jobright"];
    const finalResources: Array<{ resource: Resource; category: Category; clicks: number }> = [];

    transformedCategories.forEach((category) => {
      category.resources?.forEach((resource) => {
        if (defaultResourceTitles.includes(resource.title)) {
          finalResources.push({ resource, category, clicks: 0 });
        }
      });
      category.subcategories?.forEach((subcategory) => {
        subcategory.resources.forEach((resource) => {
          if (defaultResourceTitles.includes(resource.title)) {
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
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              PM{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Content Library
              </span>
            </h1>
            <p className="text-base text-muted-foreground mb-6">
              Everything you need to excel in your product management journey
            </p>

            {!selectedCategory && (
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base"
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
              <Carousel className="w-full">
                <CarouselContent>
                  {topResources.map(({ resource, category }, idx) => (
                    <CarouselItem key={idx} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                      <Card 
                        className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={(e) => {
                          if (resource.isPaid) {
                            e.preventDefault();
                            setSelectedPaidResource({ title: resource.title, url: resource.url });
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
                              <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                              {resource.isPaid && (
                                <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                                  <Star className="w-2 h-2 mr-0.5 fill-current" />
                                  Partner
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
                  // Show subcategories in horizontal carousel for AI Tools
                  <div className="space-y-8">
                    {selectedCategoryData.subcategories.map((subcategory, subIdx) => (
                      <div key={subIdx}>
                        <h3 className="text-xl font-bold mb-4">{subcategory.title}</h3>
                        <Carousel className="w-full">
                          <CarouselContent>
                            {subcategory.resources.map((resource, idx) => (
                              <CarouselItem key={idx} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                <Card 
                                  className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                  onClick={(e) => {
                                    if (resource.isPaid) {
                                      e.preventDefault();
                                      setSelectedPaidResource({ title: resource.title, url: resource.url });
                                    } else {
                                      trackResourceClick(resource, selectedCategoryData.id);
                                      window.open(resource.url, '_blank', 'noopener,noreferrer');
                                    }
                                  }}
                                >
                                  <CardContent className="p-2">
                                    <div className="mb-1.5">
                                      <div className="w-full aspect-square rounded-md overflow-hidden bg-muted mb-1.5 relative">
                                        <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                                        {resource.isPaid && (
                                          <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                                            <Star className="w-2 h-2 mr-0.5 fill-current" />
                                            Partner
                                          </Badge>
                                        )}
                                      </div>
                                      <h3 className="text-[10px] font-semibold mb-0.5 text-card-foreground line-clamp-2">
                                        {resource.title}
                                      </h3>
                                      <p className="text-[9px] text-muted-foreground line-clamp-2">{resource.description}</p>
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
                    ))}
                  </div>
                ) : (
                  // Regular grid view for other categories
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                    {selectedCategoryData.resources?.map((resource, idx) => (
                      <AnimatedSection key={idx} animation="slide-up" delay={idx * 100}>
                        <Card 
                          className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                          onClick={(e) => {
                            if (resource.isPaid) {
                              e.preventDefault();
                              setSelectedPaidResource({ title: resource.title, url: resource.url });
                            } else {
                              selectedCategoryData && trackResourceClick(resource, selectedCategoryData.id);
                              window.open(resource.url, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <CardContent className="p-2">
                            <div className="mb-1.5">
                              <div className="w-full aspect-square rounded-md overflow-hidden bg-muted mb-1.5 relative">
                                <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                                {resource.isPaid && (
                                  <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                                    <Star className="w-2 h-2 mr-0.5 fill-current" />
                                    Partner
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
                    className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={(e) => {
                      if (resource.isPaid) {
                        e.preventDefault();
                        setSelectedPaidResource({ title: resource.title, url: resource.url });
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
                          <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                          {resource.isPaid && (
                            <Badge className="absolute top-1 right-1 bg-gradient-to-r from-primary to-blue-500 text-white text-[7px] px-1 py-0">
                              <Star className="w-2 h-2 mr-0.5 fill-current" />
                              Partner
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
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
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
    </div>
  );
};

export default ResourcesPage;

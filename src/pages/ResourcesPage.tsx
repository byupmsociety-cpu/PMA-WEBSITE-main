import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LockedResourcesView from "@/components/LockedResourcesView";
import PaidResourceModal from "@/components/PaidResourceModal";
import PremiumResourceModal from "@/components/PremiumResourceModal";
import PresidencyConnect from "@/components/PresidencyConnect";
import ApmPlaybook from "@/components/resources/ApmPlaybook";
import PracticeInterviews from "@/components/resources/PracticeInterviews";
import ResourcesFeedback from "@/components/resources/ResourcesFeedback";
import ResourceCard, { ResourceBadges, ResourceImage } from "@/components/resources/ResourceCard";
import {
  CATEGORIES,
  isInAppGuide,
  resourceAnchorId,
  type Category,
  type Resource,
} from "@/lib/resourceCatalog";

const FEATURED_RESOURCES = CATEGORIES.flatMap((category) =>
  category.resources.filter((resource) => resource.isFeatured).map((resource) => ({ resource, category })),
);

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [focusedResource, setFocusedResource] = useState<string | null>(null);
  const { user, profile, isBlocked, loading: authLoading } = useAuth();
  const isPmaMember = !!profile?.is_pma_member && !isBlocked;
  const [selectedPaidResource, setSelectedPaidResource] = useState<{ title: string; url: string } | null>(null);
  const [selectedPremiumResource, setSelectedPremiumResource] = useState<{ title: string; url: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (focusedResource) {
      document.getElementById(resourceAnchorId(focusedResource))?.scrollIntoView({ behavior: "smooth", block: "center" });
      setFocusedResource(null);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const resourceParam = searchParams.get("resource");
    if (!resourceParam) return;

    const matchedResource = CATEGORIES.flatMap((cat) => cat.resources).find((r) => r.title === resourceParam);
    if (matchedResource?.isPaid) {
      setSelectedPaidResource({ title: matchedResource.title, url: matchedResource.url });
    }
    setSearchParams({});
  }, [searchParams, setSearchParams]);

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

  const openResource = (resource: Resource, category: Category) => {
    if (resource.isPaid) {
      setSelectedPaidResource({ title: resource.title, url: resource.url });
    } else if (resource.isPremium && !isPmaMember) {
      setSelectedPremiumResource({ title: resource.title, url: resource.url });
    } else if (isInAppGuide(resource)) {
      setFocusedResource(resource.title);
      setSelectedCategory(category.id);
    } else {
      void trackResourceClick(resource, category.id);
      window.open(resource.url, "_blank", "noopener,noreferrer");
    }
  };

  const openResourceByTitle = (title: string) => {
    for (const category of CATEGORIES) {
      const resource = category.resources.find((r) => r.title === title);
      if (resource) {
        openResource(resource, category);
        return;
      }
    }
  };

  const query = searchQuery.toLowerCase();
  const searchResults = searchQuery
    ? CATEGORIES.flatMap((category) =>
        category.resources
          .filter(
            (resource) =>
              resource.title.toLowerCase().includes(query) || resource.description.toLowerCase().includes(query),
          )
          .map((resource) => ({ resource, category })),
      )
    : [];

  const nonEmptyCategories = CATEGORIES.filter((category) => category.resources.length > 0);

  const selectedCategoryData = selectedCategory ? CATEGORIES.find((c) => c.id === selectedCategory) : null;

  if (authLoading) {
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

  if (!isPmaMember) {
    return (
      <LockedResourcesView
        isLoggedIn={!!user}
        categories={nonEmptyCategories.map((category) => ({
          id: category.id,
          title: category.title,
          description: category.description,
          icon: <category.Icon className="w-6 h-6" />,
          color: category.color,
          resourceCount: category.resources.length,
        }))}
      />
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background text-foreground overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 max-w-full">
        <AnimatedSection animation="slide-up">
          <div className="w-full max-w-3xl mx-auto text-center mb-8 px-2 md:px-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
              PM{" "}
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent break-words">
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

        {!selectedCategory && !searchQuery && (
          <ApmPlaybook onSelectCategory={setSelectedCategory} onOpenResource={openResourceByTitle} />
        )}

        {!selectedCategory && !searchQuery && <PracticeInterviews />}

        {!selectedCategory && !searchQuery && <PresidencyConnect />}

        {/* Most Useful Resources Carousel */}
        {!selectedCategory && !searchQuery && FEATURED_RESOURCES.length > 0 && (
          <AnimatedSection animation="fade-in">
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold">Most Useful Resources</h2>
              </div>
              <div className="overflow-hidden">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {FEATURED_RESOURCES.map(({ resource, category }, idx) => (
                    <CarouselItem key={idx} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <Card
                        className={`h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${resource.isPremium && !isPmaMember ? 'ring-1 ring-accent/40' : ''}`}
                        onClick={() => openResource(resource, category)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div
                              className={`w-5 h-5 shrink-0 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white`}
                            >
                              <div className="scale-[0.6]">
                                <category.Icon className="w-6 h-6" />
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground line-clamp-1">{category.title}</span>
                          </div>

                          <div className="w-full aspect-video rounded-md overflow-hidden bg-muted mb-2 relative">
                            <ResourceImage resource={resource} isPmaMember={isPmaMember} />
                            <ResourceBadges resource={resource} isPmaMember={isPmaMember} />
                          </div>
                          <h3 className="text-sm font-semibold leading-snug mb-1 text-card-foreground line-clamp-2">
                            {resource.title}
                          </h3>
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                            {resource.description}
                          </p>
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
                    <selectedCategoryData.Icon className="w-6 h-6" />
                    <h2 className="text-2xl font-bold">{selectedCategoryData.title}</h2>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedCategoryData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {selectedCategoryData.resources.map((resource, idx) => (
                    <AnimatedSection key={`${selectedCategoryData.id}-${resource.title}`} animation="slide-up" delay={idx * 50} className="h-full">
                      <ResourceCard
                        resource={resource}
                        category={selectedCategoryData}
                        isPmaMember={isPmaMember}
                        onOpen={trackResourceClick}
                      />
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        ) : searchQuery && searchResults.length > 0 ? (
          // Search Results View
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">
              Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.map(({ resource, category }, idx) => (
                <AnimatedSection key={`${category.id}-${resource.title}`} animation="slide-up" delay={idx * 50} className="h-full">
                  <ResourceCard
                    resource={resource}
                    category={category}
                    isPmaMember={isPmaMember}
                    showCategory
                    onOpen={trackResourceClick}
                  />
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
            {nonEmptyCategories.map((category, idx) => (
              <AnimatedSection key={category.id} animation="slide-up" delay={idx * 100}>
                <Card
                  className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-5">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                    >
                      <category.Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors truncate">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 break-words">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category.resources.length} resources
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

        <ResourcesFeedback />
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

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Linkedin, Building2, Coffee, Briefcase, Cpu, ArrowLeft, Search, TrendingUp, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import PaidResourceModal from "@/components/PaidResourceModal";
import jobrightImg from "@/assets/jobright.jpg";
import pmflabsImg from "@/assets/pmflabs.jpg";
import linkedinGuideImg from "@/assets/linkedin-guide.jpg";
import hubspotLinkedinImg from "@/assets/hubspot-linkedin.jpg";
import glassdoorImg from "@/assets/glassdoor.jpg";
import levelsFyiImg from "@/assets/levels-fyi.png";
import coffeeChatImg from "@/assets/coffee-chat.jpg";
import newgradJobsImg from "@/assets/newgrad-jobs.jpg";
import internListImg from "@/assets/intern-list.jpg";
import linkedinJobsImg from "@/assets/linkedin-jobs.jpg";
import apmSeasonImg from "@/assets/apm-season.jpg";
import lovableImg from "@/assets/lovable.png";
import replitImg from "@/assets/replit.jpg";
import base44Img from "@/assets/base44.jpg";
import claudeCodeImg from "@/assets/claude-code.jpg";
import azureAiImg from "@/assets/azure-ai.jpg";
import huggingfaceImg from "@/assets/huggingface.jpg";
import vertexAiImg from "@/assets/vertex-ai.jpg";
import firebaseStudioImg from "@/assets/firebase-studio.jpg";
import cursorImg from "@/assets/cursor.jpg";
import relayImg from "@/assets/relay.jpg";
import lelandImg from "@/assets/leland.png";
import kiroImg from "@/assets/kiro.jpg";

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

const categories: Category[] = [
  {
    id: "ai-tools",
    title: "AI Tools to Build",
    description: "Build projects with cutting-edge AI tools",
    icon: <Cpu className="w-6 h-6" />,
    color: "from-violet-500 to-purple-500",
    subcategories: [
      {
        id: "low-no-code",
        title: "Low - No Code",
        resources: [
          {
            title: "Lovable.dev",
            description: "Create apps and websites by chatting with AI.",
            url: "https://lovable.dev",
            image: lovableImg,
          },
          {
            title: "Replit",
            description: "Collaborative coding platform with AI assistance.",
            url: "https://replit.com",
            image: replitImg,
          },
          {
            title: "Base44",
            description: "No-code platform for building modern applications.",
            url: "https://base44.com",
            image: base44Img,
          },
          {
            title: "Firebase Studio",
            description: "Accelerate development with AI agents.",
            url: "https://firebase.studio",
            image: firebaseStudioImg,
          },
          {
            title: "Kiro.dev",
            description: "AI-powered no-code platform for building applications.",
            url: "https://kiro.dev",
            image: kiroImg,
          },
        ],
      },
      {
        id: "ai-llm",
        title: "AI and LLM",
        resources: [
          {
            title: "Azure AI",
            description: "Explore AI solutions with Azure.",
            url: "https://ai.azure.com",
            image: azureAiImg,
          },
          {
            title: "Hugging Face",
            description: "Collaborate on models, datasets, and applications.",
            url: "https://huggingface.co",
            image: huggingfaceImg,
          },
          {
            title: "Google Vertex AI",
            description: "Build and deploy AI models on Google Cloud.",
            url: "https://console.cloud.google.com/vertex-ai/studio",
            image: vertexAiImg,
          },
        ],
      },
      {
        id: "code-with-ai",
        title: "Code With AI",
        resources: [
          {
            title: "Cursor",
            description: "AI code editor with a free year subscription for students.",
            url: "https://cursor.com/students",
            image: cursorImg,
          },
          {
            title: "Claude Code",
            description: "AI-powered coding assistant by Anthropic.",
            url: "https://claude.ai",
            image: claudeCodeImg,
          },
        ],
      },
      {
        id: "automation",
        title: "Automation",
        resources: [
          {
            title: "Relay.app",
            description: "Create AI agents that work for you with Relay.app.",
            url: "https://www.relay.app",
            image: relayImg,
          },
        ],
      },
    ],
  },
  {
    id: "resume-interview",
    title: "Resume & Interview Guide",
    description: "Build a standout resume and ace your interviews",
    icon: <FileText className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    resources: [
      {
        title: "Jobright.ai",
        description: "AI-powered job search copilot for more interviews with less effort.",
        url: "https://jobright.ai/jobs/resume",
        image: jobrightImg,
      },
      {
        title: "PMF Labs",
        description: "Use AI tools to practice and improve your interview skills.",
        url: "https://www.pmflabs.ai",
        image: pmflabsImg,
        isPaid: true,
        tips: [
          "Practice, practice, practice",
          "Find common interview questions and write out concise stories",
          "Practice at least once a week with a friend or tool",
        ],
      },
      {
        title: "Leland+",
        description: "Access to recruiting resources created by industry professionals",
        url: "https://start.joinleland.com/campus-race?utm_source=amb-byu-dylan-mattern&utm_campaign=leland_plus_student",
        image: lelandImg,
        isPaid: true,
      },
    ],
  },
  {
    id: "linkedin",
    title: "LinkedIn Optimization",
    description: "Perfect your LinkedIn profile to attract recruiters",
    icon: <Linkedin className="w-6 h-6" />,
    color: "from-blue-600 to-blue-400",
    resources: [
      {
        title: "LinkedIn's Official Guide",
        description: "Explore LinkedIn's tips and best practices for optimizing your profile.",
        url: "https://www.linkedin.com/help/linkedin/answer/4443",
        image: linkedinGuideImg,
        tips: [
          "Show your personality - recruiters assess cultural fit",
          "Be involved - make posts, share updates, comment to increase visibility",
          "Follow people and companies you're interested in",
        ],
      },
      {
        title: "HubSpot's LinkedIn Tips",
        description: "Learn how to optimize your LinkedIn profile with HubSpot's comprehensive guide.",
        url: "https://blog.hubspot.com/marketing/linkedin-profile-tips",
        image: hubspotLinkedinImg,
      },
    ],
  },
  {
    id: "company-research",
    title: "Company Research",
    description: "Research companies and understand their culture",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    resources: [
      {
        title: "Glassdoor",
        description: "Read company reviews and learn about their culture.",
        url: "https://www.glassdoor.com",
        image: glassdoorImg,
        tips: [
          "Create a list of your top 10 target companies",
          "Explore company websites and news articles",
          "Consider locations, reviews, and salary insights",
          "Ensure it's a company or product you're excited about",
        ],
      },
      {
        title: "Levels.fyi",
        description: "Get insights on salary levels. These tend to be pretty accurate!",
        url: "https://www.levels.fyi",
        image: levelsFyiImg,
      },
    ],
  },
  {
    id: "networking",
    title: "Networking & Coffee Chats",
    description: "Connect with industry professionals and build relationships",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
    resources: [
      {
        title: "Coffee Chat Guide",
        description: "Learn how to conduct effective coffee chats and informational interviews.",
        url: "#",
        image: coffeeChatImg,
        tips: [
          "Connect with BYU alumni and conduct informational interviews",
          "Learn about their company, projects, and culture",
          "Make it friendly and get to know them personally",
          "Ask if they would be willing to provide a referral",
          "Get insider tips on how to stand out as an applicant",
        ],
      },
    ],
  },
  {
    id: "job-search",
    title: "Job Search Tools",
    description: "Find and apply for PM positions and internships",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    resources: [
      {
        title: "NewGrad Jobs",
        description: "Explore entry-level job opportunities for new graduates.",
        url: "https://www.newgrad-jobs.com",
        image: newgradJobsImg,
        tips: [
          "Use job search engines and company career pages",
          "Set alerts for positions matching your criteria",
          "Customize your resume and cover letter for each application",
          "Try to get a referral before applying",
        ],
      },
      {
        title: "Intern List",
        description: "Find internships and entry-level positions across various industries.",
        url: "https://www.intern-list.com",
        image: internListImg,
      },
      {
        title: "LinkedIn Jobs",
        description: "Find job openings and connect with recruiters on LinkedIn.",
        url: "https://www.linkedin.com/jobs/",
        image: linkedinJobsImg,
      },
      {
        title: "APM Season",
        description: "Stay up-to-date on the latest APM programs and internships for aspiring product managers.",
        url: "https://www.apmseason.com",
        image: apmSeasonImg,
      },
      {
        title: "Jobright",
        description: "Utilize AI to find job matches and streamline your job search process.",
        url: "https://jobright.ai",
        image: jobrightImg,
      },
    ],
  },
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [topResources, setTopResources] = useState<Array<{ resource: Resource; category: Category; clicks: number }>>(
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const [selectedPaidResource, setSelectedPaidResource] = useState<{ title: string; url: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTopResources();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Check if we need to open a modal for a paid resource after auth
    const resourceParam = searchParams.get("resource");
    if (resourceParam) {
      let matchedResource: Resource | undefined;
      
      // Search through all categories
      for (const cat of categories) {
        // Check direct resources
        matchedResource = cat.resources?.find(r => r.title === resourceParam);
        if (matchedResource) break;
        
        // Check subcategory resources
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
      // Clear the param
      setSearchParams({});
    }

    return () => subscription.unsubscribe();
  }, []);

  const fetchTopResources = async () => {
    // Get click counts from the database
    const { data: clickData } = await supabase.from("resource_clicks").select("resource_title, category_id");

    // Count clicks per resource
    const clickCounts: Record<string, { count: number; categoryId: string }> = {};
    clickData?.forEach((click) => {
      const key = click.resource_title;
      if (!clickCounts[key]) {
        clickCounts[key] = { count: 0, categoryId: click.category_id };
      }
      clickCounts[key].count++;
    });

    // Default resources to always show (3 defaults)
    const defaultResources = ["PMF Labs", "Lovable.dev", "Leland+"];

    // Get top 5 clicked resources (excluding defaults)
    const topClicked = Object.entries(clickCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .filter(([title]) => !defaultResources.includes(title))
      .slice(0, 5)
      .map(([title, data]) => ({ title, ...data }));

    // Build final list: defaults first, then top clicked
    const finalResources: Array<{ resource: Resource; category: Category; clicks: number }> = [];

    // Add default resources
    categories.forEach((category) => {
      // Check resources directly on category
      category.resources?.forEach((resource) => {
        if (defaultResources.includes(resource.title)) {
          finalResources.push({
            resource,
            category,
            clicks: clickCounts[resource.title]?.count || 0,
          });
        }
      });
      
      // Check resources in subcategories
      category.subcategories?.forEach((subcategory) => {
        subcategory.resources.forEach((resource) => {
          if (defaultResources.includes(resource.title)) {
            finalResources.push({
              resource,
              category,
              clicks: clickCounts[resource.title]?.count || 0,
            });
          }
        });
      });
    });

    // Add top clicked resources
    topClicked.forEach(({ title, categoryId, count }) => {
      const category = categories.find((c) => c.id === categoryId);
      let resource: Resource | undefined;
      
      // Check resources directly on category
      resource = category?.resources?.find((r) => r.title === title);
      
      // If not found, check subcategories
      if (!resource && category?.subcategories) {
        for (const subcategory of category.subcategories) {
          resource = subcategory.resources.find((r) => r.title === title);
          if (resource) break;
        }
      }
      
      if (resource && category) {
        finalResources.push({ resource, category, clicks: count });
      }
    });

    // Show up to 8 resources total (3 defaults + 5 top clicked)
    setTopResources(finalResources);
  };

  const trackResourceClick = async (resource: Resource, categoryId: string, e?: React.MouseEvent) => {
    // Handle paid resources
    if (resource.isPaid) {
      e?.preventDefault();
      setSelectedPaidResource({ title: resource.title, url: resource.url });
      return;
    }

    await supabase.from("resource_clicks").insert({
      resource_title: resource.title,
      category_id: categoryId,
    });
    // Refresh top resources after tracking click
    fetchTopResources();
  };

  const searchResults = searchQuery
    ? categories.flatMap((category) => {
        const results: Array<{ resource: Resource; category: Category }> = [];
        
        // Search in direct resources
        category.resources?.forEach((resource) => {
          if (
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            results.push({ resource, category });
          }
        });
        
        // Search in subcategory resources
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

        {/* Most Used Resources Carousel */}
        {!selectedCategory && !searchQuery && topResources.length > 0 && (
          <AnimatedSection animation="fade-in">
            <div className="max-w-6xl mx-auto mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="text-lg font-bold">Most Used by Students</h2>
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
                              <img src={resource.image} alt={resource.title} className={`w-full h-full ${resource.image === lovableImg ? 'object-contain scale-150' : 'object-cover'}`} />
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
                                        <img src={resource.image} alt={resource.title} className={`w-full h-full ${resource.image === lovableImg ? 'object-contain scale-150' : 'object-cover'}`} />
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
                                <img src={resource.image} alt={resource.title} className={`w-full h-full ${resource.image === lovableImg ? 'object-contain scale-150' : 'object-cover'}`} />
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
                          <img src={resource.image} alt={resource.title} className={`w-full h-full ${resource.image === lovableImg ? 'object-contain scale-150' : 'object-cover'}`} />
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
      />
    </div>
  );
};

export default ResourcesPage;

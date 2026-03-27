import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Search, 
  Star, 
  Bell, 
  Settings, 
  Loader2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Users
} from "lucide-react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string | null;
  url: string;
  job_type: string | null;
  industry: string | null;
  location: string | null;
  company_size: string | null;
  salary_range: string | null;
  deadline: string | null;
  is_featured: boolean;
  created_at: string;
}

interface JobNotification {
  job_id: string;
  viewed_at: string | null;
  applied: boolean;
  saved: boolean;
}

const JOB_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

const LOCATIONS = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "utah", label: "Utah" },
  { value: "california", label: "California" },
  { value: "new-york", label: "New York" },
  { value: "texas", label: "Texas" },
  { value: "washington", label: "Washington" },
  { value: "colorado", label: "Colorado" },
  { value: "other", label: "Other US" },
];

const JobsPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [notifications, setNotifications] = useState<Map<string, JobNotification>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [alumniCompanies, setAlumniCompanies] = useState<Record<string, number>>({});

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isPmaMember) {
        void loadJobs();
        void loadNotifications();
        void loadAlumniCompanies();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, user, isPmaMember, navigate]);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading jobs:", error);
    } else {
      setJobs(data ?? []);
    }
    setLoading(false);
  };

  const loadNotifications = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("job_notifications")
      .select("job_id, viewed_at, applied, saved")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error loading notifications:", error);
    } else {
      const notifMap = new Map<string, JobNotification>();
      data?.forEach((n) => notifMap.set(n.job_id, n));
      setNotifications(notifMap);
    }
  };

  const loadAlumniCompanies = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("current_company")
      .eq("is_alumni", true)
      .not("current_company", "is", null);

    if (!error && data) {
      const counts: Record<string, number> = {};
      data.forEach((p) => {
        if (p.current_company) {
          const comp = p.current_company.toLowerCase().trim();
          counts[comp] = (counts[comp] || 0) + 1;
        }
      });
      setAlumniCompanies(counts);
    }
  };

  const markAsViewed = async (jobId: string) => {
    if (!user) return;
    
    const existing = notifications.get(jobId);
    if (existing?.viewed_at) return;

    await supabase.from("job_notifications").upsert({
      user_id: user.id,
      job_id: jobId,
      viewed_at: new Date().toISOString(),
    }, { onConflict: "user_id,job_id" });

    await loadNotifications();
  };

  const toggleSaved = async (job: JobPosting, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const existing = notifications.get(job.id);
    const newSaved = !existing?.saved;

    await supabase.from("job_notifications").upsert({
      user_id: user.id,
      job_id: job.id,
      saved: newSaved,
    }, { onConflict: "user_id,job_id" });

    // Also sync to application tracker if saving
    if (newSaved) {
       await supabase.from("job_applications").insert({
         user_id: user.id,
         job_posting_id: job.id,
         company_name: job.company,
         job_title: job.title,
         status: 'wishlist'
       });
    }

    await loadNotifications();
  };

  const toggleApplied = async (job: JobPosting, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const existing = notifications.get(job.id);
    const newApplied = !existing?.applied;

    await supabase.from("job_notifications").upsert({
      user_id: user.id,
      job_id: job.id,
      applied: newApplied,
    }, { onConflict: "user_id,job_id" });

    // Also sync to application tracker automatically
    if (newApplied) {
       await supabase.from("job_applications").insert({
         user_id: user.id,
         job_posting_id: job.id,
         company_name: job.company,
         job_title: job.title,
         status: 'applied',
         applied_date: new Date().toISOString()
       });
    }

    await loadNotifications();
  };

  const handleJobClick = (job: JobPosting) => {
    markAsViewed(job.id);
    window.open(job.url, "_blank", "noopener,noreferrer");
  };

  const filteredJobs = jobs.filter((job) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !job.title.toLowerCase().includes(query) &&
        !job.company.toLowerCase().includes(query) &&
        !(job.description?.toLowerCase().includes(query))
      ) {
        return false;
      }
    }
    if (filterType !== "all" && job.job_type !== filterType) return false;
    if (filterLocation !== "all" && job.location !== filterLocation) return false;
    if (showSavedOnly && !notifications.get(job.id)?.saved) return false;
    return true;
  });

  const newJobsCount = jobs.filter((job) => !notifications.get(job.id)?.viewed_at).length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return <MemberLockout 
      description="The job board is exclusive to PMA club members. Join PMA to access curated job opportunities and get notified when positions matching your preferences are posted."
      features={[
        "Access exclusive PM internship & new grad roles",
        "Filter by visa sponsorship and location",
        "Save jobs and track application deadlines",
        "Get notified instantly when new roles drop"
      ]}
    />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container max-w-5xl mx-auto px-4">
        <AnimatedSection animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job Board</h1>
              <p className="text-muted-foreground">
                Curated PM opportunities for PMA members
                {newJobsCount > 0 && (
                  <Badge className="ml-2 bg-primary">{newJobsCount} new</Badge>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/preferences">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection animation="slide-up" delay={100}>
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={showSavedOnly ? "default" : "outline"}
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                  className="whitespace-nowrap"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <AnimatedSection animation="fade-in">
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {showSavedOnly
                      ? "No saved jobs yet. Save jobs to view them here."
                      : "No jobs match your filters."}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ) : (
            filteredJobs.map((job, idx) => {
              const notification = notifications.get(job.id);
              const isNew = !notification?.viewed_at;
              const isSaved = notification?.saved;
              const isApplied = notification?.applied;
              const deadlineSoon = job.deadline && 
                isWithinInterval(new Date(job.deadline), {
                  start: new Date(),
                  end: addDays(new Date(), 7),
                });
              const deadlinePassed = job.deadline && isPast(new Date(job.deadline));

              return (
                <AnimatedSection key={job.id} animation="slide-up" delay={idx * 50}>
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      job.is_featured ? 'ring-2 ring-amber-500/50 bg-amber-500/5' : ''
                    } ${isNew ? 'border-primary/50' : ''}`}
                    onClick={() => handleJobClick(job)}
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            {job.is_featured && (
                              <Badge className="bg-amber-500 text-white">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                            {isNew && (
                              <Badge variant="outline" className="border-primary text-primary">
                                New
                              </Badge>
                            )}
                            {isApplied && (
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Applied
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {LOCATIONS.find((l) => l.value === job.location)?.label ?? job.location}
                              </span>
                            )}
                            {job.job_type && (
                              <Badge variant="secondary">
                                {JOB_TYPES.find((t) => t.value === job.job_type)?.label ?? job.job_type}
                              </Badge>
                            )}
                            {alumniCompanies[job.company.toLowerCase().trim()] > 0 && (
                              <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50/50">
                                <Users className="w-3 h-3 mr-1" />
                                {alumniCompanies[job.company.toLowerCase().trim()]} Alumni here
                              </Badge>
                            )}
                          </div>

                          {job.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {job.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                            {job.salary_range && (
                              <span>{job.salary_range}</span>
                            )}
                            {job.deadline && (
                              <span className={`flex items-center gap-1 ${
                                deadlinePassed ? 'text-red-500' : deadlineSoon ? 'text-amber-500' : ''
                              }`}>
                                <Calendar className="w-3 h-3" />
                                {deadlinePassed 
                                  ? 'Deadline passed' 
                                  : `Apply by ${format(new Date(job.deadline), "MMM d")}`}
                              </span>
                            )}
                            <span>
                              Posted {format(new Date(job.created_at), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleSaved(job, e)}
                            className={isSaved ? 'text-primary' : ''}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleApplied(job, e)}
                            className={isApplied ? 'text-green-500' : ''}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })
          )}
        </div>

        {/* CTA for preferences */}
        {jobs.length > 0 && (
          <AnimatedSection animation="fade-in" delay={300}>
            <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="py-6 text-center">
                <Bell className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Get Job Alerts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set your job preferences to get notified when matching opportunities are posted.
                </p>
                <Button asChild>
                  <Link to="/preferences">Set Preferences</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default JobsPage;

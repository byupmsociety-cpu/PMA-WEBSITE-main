import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Building2, MapPin, DollarSign, Bell, Save, Loader2 } from "lucide-react";

interface JobPreferences {
  id?: string;
  job_types: string[];
  industries: string[];
  locations: string[];
  company_sizes: string[];
  min_salary: number | null;
  salary_type: 'annual' | 'hourly';
  is_actively_looking: boolean;
  notify_email: boolean;
  notify_in_app: boolean;
}

const JOB_TYPES = [
  { id: "internship", label: "Internship" },
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
];

const INDUSTRIES = [
  { id: "tech", label: "Technology" },
  { id: "consulting", label: "Consulting" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "retail", label: "Retail / E-commerce" },
  { id: "media", label: "Media / Entertainment" },
  { id: "education", label: "Education" },
  { id: "saas", label: "SaaS" },
  { id: "consumer", label: "Consumer Products" },
  { id: "enterprise", label: "Enterprise Software" },
];

const LOCATIONS = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "utah", label: "Utah" },
  { id: "california", label: "California" },
  { id: "new-york", label: "New York" },
  { id: "texas", label: "Texas" },
  { id: "washington", label: "Washington" },
  { id: "colorado", label: "Colorado" },
  { id: "other", label: "Other US" },
];

const COMPANY_SIZES = [
  { id: "startup", label: "Startup (< 50 employees)" },
  { id: "mid-size", label: "Mid-size (50-500 employees)" },
  { id: "enterprise", label: "Enterprise (500+ employees)" },
];

const defaultPreferences: JobPreferences = {
  job_types: [],
  industries: [],
  locations: [],
  company_sizes: [],
  min_salary: null,
  salary_type: 'annual',
  is_actively_looking: true,
  notify_email: true,
  notify_in_app: true,
};

const JobPreferencesPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<JobPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else {
        void loadPreferences();
      }
    }
  }, [authLoading, user, navigate]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("job_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading preferences:", error);
    }

    if (data) {
      setPreferences({
        id: data.id,
        job_types: data.job_types ?? [],
        industries: data.industries ?? [],
        locations: data.locations ?? [],
        company_sizes: data.company_sizes ?? [],
        min_salary: data.min_salary,
        salary_type: data.salary_type || 'annual',
        is_actively_looking: data.is_actively_looking ?? true,
        notify_email: data.notify_email ?? true,
        notify_in_app: data.notify_in_app ?? true,
      });
      setHasExisting(true);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !isPmaMember) return;

    setSaving(true);
    
    const payload = {
      user_id: user.id,
      job_types: preferences.job_types,
      industries: preferences.industries,
      locations: preferences.locations,
      company_sizes: preferences.company_sizes,
      min_salary: preferences.min_salary,
      salary_type: preferences.salary_type,
      is_actively_looking: preferences.is_actively_looking,
      notify_email: preferences.notify_email,
      notify_in_app: preferences.notify_in_app,
    };

    let error;
    if (hasExisting && preferences.id) {
      const result = await supabase
        .from("job_preferences")
        .update(payload)
        .eq("id", preferences.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("job_preferences")
        .insert(payload);
      error = result.error;
    }

    if (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preferences saved",
        description: "You'll be notified when matching jobs are posted.",
      });
      setHasExisting(true);
      await loadPreferences();
    }
    setSaving(false);
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return <MemberLockout 
      description="Job preferences and alerts are exclusive to PMA club members. Join PMA to get personalized job notifications when opportunities matching your criteria are posted." 
      features={[
        "Set up personalized PM job alerts",
        "Choose daily or weekly email digests",
        "Never miss a role that fits your specific criteria",
        "Stay ahead of the competition"
      ]}
    />;
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 max-w-full">
        <AnimatedSection animation="slide-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Job Preferences</h1>
            <p className="text-muted-foreground">
              Set your job search criteria and get notified when matching opportunities are posted.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {/* Active Status */}
          <AnimatedSection animation="slide-up" delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Job Search Status
                </CardTitle>
                <CardDescription>
                  Let us know if you're actively looking for opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="actively-looking" className="text-base font-medium">
                      I'm actively looking for jobs
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Turn this off to pause job notifications
                    </p>
                  </div>
                  <Switch
                    id="actively-looking"
                    checked={preferences.is_actively_looking}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, is_actively_looking: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Job Types */}
          <AnimatedSection animation="slide-up" delay={150}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Types
                </CardTitle>
                <CardDescription>
                  What types of positions are you interested in?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {JOB_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`job-type-${type.id}`}
                        checked={preferences.job_types.includes(type.id)}
                        onCheckedChange={() =>
                          setPreferences({
                            ...preferences,
                            job_types: toggleArrayItem(preferences.job_types, type.id),
                          })
                        }
                      />
                      <Label htmlFor={`job-type-${type.id}`} className="cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Industries */}
          <AnimatedSection animation="slide-up" delay={200}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Industries
                </CardTitle>
                <CardDescription>
                  Which industries interest you?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {INDUSTRIES.map((industry) => (
                    <div key={industry.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry.id}`}
                        checked={preferences.industries.includes(industry.id)}
                        onCheckedChange={() =>
                          setPreferences({
                            ...preferences,
                            industries: toggleArrayItem(preferences.industries, industry.id),
                          })
                        }
                      />
                      <Label htmlFor={`industry-${industry.id}`} className="cursor-pointer">
                        {industry.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Locations */}
          <AnimatedSection animation="slide-up" delay={250}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Locations
                </CardTitle>
                <CardDescription>
                  Where would you like to work?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {LOCATIONS.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location.id}`}
                        checked={preferences.locations.includes(location.id)}
                        onCheckedChange={() =>
                          setPreferences({
                            ...preferences,
                            locations: toggleArrayItem(preferences.locations, location.id),
                          })
                        }
                      />
                      <Label htmlFor={`location-${location.id}`} className="cursor-pointer">
                        {location.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Company Size */}
          <AnimatedSection animation="slide-up" delay={300}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Size
                </CardTitle>
                <CardDescription>
                  What size companies are you interested in?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {COMPANY_SIZES.map((size) => (
                    <div key={size.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`company-size-${size.id}`}
                        checked={preferences.company_sizes.includes(size.id)}
                        onCheckedChange={() =>
                          setPreferences({
                            ...preferences,
                            company_sizes: toggleArrayItem(preferences.company_sizes, size.id),
                          })
                        }
                      />
                      <Label htmlFor={`company-size-${size.id}`} className="cursor-pointer">
                        {size.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Salary */}
          <AnimatedSection animation="slide-up" delay={350}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Minimum Salary (Optional)
                </CardTitle>
                <CardDescription>
                  Set a minimum salary expectation (annual, USD)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 max-w-sm">
                  <Input
                    type="number"
                    placeholder={preferences.salary_type === 'hourly' ? "e.g. 30" : "e.g., 80000"}
                    value={preferences.min_salary ?? ""}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        min_salary: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                  />
                  <Select 
                    value={preferences.salary_type} 
                    onValueChange={(val: 'annual' | 'hourly') => setPreferences({...preferences, salary_type: val})}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual ($)</SelectItem>
                      <SelectItem value="hourly">Hourly ($/hr)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Notification Settings */}
          <AnimatedSection animation="slide-up" delay={400}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  How would you like to be notified about matching jobs?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-email" className="text-base font-medium">
                      Email notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive job alerts via email
                    </p>
                  </div>
                  <Switch
                    id="notify-email"
                    checked={preferences.notify_email}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, notify_email: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-in-app" className="text-base font-medium">
                      In-app notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      See job alerts when you visit the site
                    </p>
                  </div>
                  <Switch
                    id="notify-in-app"
                    checked={preferences.notify_in_app}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, notify_in_app: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Save Button */}
          <AnimatedSection animation="slide-up" delay={450}>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/jobs")}>
                View Jobs
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default JobPreferencesPage;

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Loader2,
  Lock,
  Crown,
  Linkedin,
  GraduationCap,
  Briefcase,
  Users,
  Settings,
  Coffee,
  Building2,
} from "lucide-react";

interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  school_year: string | null;
  recruiting_stage: string | null;
  target_roles: string[] | null;
  linkedin_url: string | null;
  bio: string | null;
  is_alumni: boolean | null;
  open_to_coffee_chats: boolean | null;
  current_company: string | null;
}

const RECRUITING_STAGES = [
  { value: "exploring", label: "Exploring PM", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "applying", label: "Actively Applying", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "interviewing", label: "Currently Interviewing", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "offer", label: "Received Offer", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  { value: "not_looking", label: "Not Looking", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
];

const SCHOOL_YEARS = [
  { value: "Freshman", label: "Freshman" },
  { value: "Sophomore", label: "Sophomore" },
  { value: "Junior", label: "Junior" },
  { value: "Senior", label: "Senior" },
  { value: "Graduate", label: "Graduate" },
];

const MembersPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [showAlumniOnly, setShowAlumniOnly] = useState(false);
  const [showChatsOnly, setShowChatsOnly] = useState(false);

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isPmaMember) {
        void loadMembers();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, user, isPmaMember, navigate]);

  const loadMembers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, full_name, avatar_url, school_year, recruiting_stage, target_roles, linkedin_url, bio, is_alumni, open_to_coffee_chats, current_company")
      .eq("is_pma_member", true)
      .eq("is_visible_in_directory", true)
      .is("deleted_at", null)
      .eq("is_blocked", false)
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error loading members:", error);
    } else {
      setMembers(data ?? []);
    }
    setLoading(false);
  };

  const filteredMembers = members.filter((member) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !member.full_name?.toLowerCase().includes(query) &&
        !member.bio?.toLowerCase().includes(query) &&
        !member.target_roles?.some((role) => role.toLowerCase().includes(query))
      ) {
        return false;
      }
    }
    if (filterStage !== "all" && member.recruiting_stage !== filterStage) return false;
    if (filterYear !== "all" && member.school_year !== filterYear) return false;
    if (showAlumniOnly && !member.is_alumni) return false;
    if (showChatsOnly && !member.open_to_coffee_chats) return false;
    return true;
  });

  const getStageConfig = (stage: string | null) => {
    return RECRUITING_STAGES.find((s) => s.value === stage) ?? RECRUITING_STAGES[0];
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stageCounts = RECRUITING_STAGES.map((stage) => ({
    ...stage,
    count: members.filter((m) => m.recruiting_stage === stage.value).length,
  }));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="container max-w-2xl mx-auto px-4">
          <AnimatedSection animation="slide-up">
            <Card className="border-amber-500/30">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold">PMA Members Only</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The member directory is exclusive to PMA club members. Join PMA to
                  connect with fellow PM aspirants and see who's recruiting.
                </p>
                <Button
                  onClick={() =>
                    window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")
                  }
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Join PMA
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <AnimatedSection animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
              <p className="text-muted-foreground">
                Connect with {members.length} PMA members on their PM journey
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <Settings className="w-4 h-4 mr-2" />
                Edit My Profile
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        {/* Stage Overview */}
        <AnimatedSection animation="slide-up" delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {stageCounts.map((stage) => (
              <Card
                key={stage.value}
                className={`cursor-pointer transition-all ${
                  filterStage === stage.value ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setFilterStage(filterStage === stage.value ? "all" : stage.value)}
              >
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{stage.count}</p>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection animation="slide-up" delay={150}>
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, role, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Recruiting Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {RECRUITING_STAGES.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="School Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {SCHOOL_YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  variant={showAlumniOnly ? "default" : "outline"}
                  className="cursor-pointer font-medium px-3 py-1 text-sm border-primary/20 hover:border-primary/50"
                  onClick={() => setShowAlumniOnly(!showAlumniOnly)}
                >
                  <GraduationCap className="w-3.5 h-3.5 mr-1" />
                  Alumni Only
                </Badge>
                <Badge
                  variant={showChatsOnly ? "default" : "outline"}
                  className="cursor-pointer font-medium px-3 py-1 text-sm border-primary/20 hover:border-primary/50"
                  onClick={() => setShowChatsOnly(!showChatsOnly)}
                >
                  <Coffee className="w-3.5 h-3.5 mr-1 text-[#C08A66]" />
                  Open to Coffee Chats
                </Badge>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <AnimatedSection animation="fade-in">
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No members match your filters.</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, idx) => {
              const stageConfig = getStageConfig(member.recruiting_stage);

              return (
                <AnimatedSection key={member.id} animation="slide-up" delay={200 + idx * 30}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={member.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(member.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{member.full_name || "Anonymous"}</h3>
                            {member.linkedin_url && (
                              <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            {member.school_year && (
                              <span className="flex items-center gap-1">
                                <GraduationCap className="w-3 h-3" />
                                {member.school_year}
                              </span>
                            )}
                          </div>
                          {member.recruiting_stage && !member.is_alumni && (
                            <Badge variant="outline" className={stageConfig.color}>
                              {stageConfig.label}
                            </Badge>
                          )}
                          {member.is_alumni && (
                            <Badge variant="default" className="bg-primary hover:bg-primary/90">
                              Alumni
                            </Badge>
                          )}
                        </div>
                      </div>

                      {member.current_company && (
                        <div className="flex items-center gap-2 text-sm font-medium mt-3 text-foreground">
                          <Building2 className="w-4 h-4 text-primary" />
                          {member.current_company}
                        </div>
                      )}

                      {member.bio && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {member.bio}
                        </p>
                      )}

                      {member.target_roles && member.target_roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {member.target_roles.slice(0, 3).map((role, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {role}
                            </Badge>
                          ))}
                          {member.target_roles.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.target_roles.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {member.open_to_coffee_chats && (
                        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-[#C08A66] bg-[#C08A66]/10 py-1.5 px-3 rounded-full w-fit">
                          <Coffee className="w-3.5 h-3.5" />
                          Open to Coffee Chats
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersPage;

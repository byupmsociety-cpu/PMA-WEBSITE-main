import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { MemberProfileModal } from "@/components/MemberProfileModal";
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
  Linkedin,
  GraduationCap,
  Briefcase,
  Users,
  Settings,
  Coffee,
  Building2,
  Copy,
  Check,
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
  email: string | null;
  role: string | null;
}

const RECRUITING_STAGES = [
  { value: "exploring", label: "Exploring PM", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  { value: "applying", label: "Actively Applying", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  { value: "interviewing", label: "Currently Interviewing", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  { value: "offer", label: "Received Offer", color: "bg-green-500/10 text-green-600 border-green-500/20" },
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
  const { toast } = useToast();

  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [showAlumniOnly, setShowAlumniOnly] = useState(false);
  const [showChatsOnly, setShowChatsOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Profile Modal State
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent, email: string, memberId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedId(memberId);
    toast({
      title: "Email copied",
      description: "Email address copied to clipboard."
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

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
      .select("id, user_id, full_name, avatar_url, school_year, recruiting_stage, target_roles, linkedin_url, bio, is_alumni, open_to_coffee_chats, current_company, email, role")
      .eq("is_pma_member", true)
      .in("role", ["member", "admin"])
      .eq("is_visible_in_directory", true)
      .is("deleted_at", null)
      .eq("is_blocked", false)
      .neq("full_name", "PMA Super Admin")
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
    return <MemberLockout
      description="The member directory is exclusive to PMA club members. Join PMA to connect with fellow PM aspirants and see who's recruiting."
      features={[
        "Connect with 150+ active PMA members",
        "Find peers recruiting for the same roles",
        "Discover where alumni are working",
        "Directly reach out to members for coffee chats"
      ]}
    />;
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-12 md:pb-20 bg-background overflow-x-hidden">
      <div className="container max-w-6xl mx-auto px-4 max-w-full">
        {/* Header */}
        <AnimatedSection animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
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
                className={`cursor-pointer transition-all ${filterStage === stage.value ? "ring-2 ring-primary" : ""
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
                  <Card 
                    className="h-full hover:shadow-lg transition-all duration-300 border-border cursor-pointer group"
                    onClick={() => {
                        setSelectedMember(member);
                        setIsModalOpen(true);
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={member.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(member.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2 md:mb-1">
                            <h3 className="font-semibold truncate">{member.full_name || "Anonymous"}</h3>
                            <div className="flex items-center gap-1.5 md:gap-2">
                              {member.linkedin_url && (
                                <a
                                  href={member.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                  title="LinkedIn Profile"
                                >
                                  <Linkedin className="w-4 h-4" />
                                </a>
                              )}
                              {member.email && (
                                <div
                                  className="group flex items-center min-w-0 flex-1 hover:bg-muted/50 rounded-md py-0.5 px-1.5 -ml-1.5 transition-colors cursor-pointer"
                                  onClick={(e) => handleCopyEmail(e, member.email!, member.id)}
                                  title="Copy Email"
                                >
                                  <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                                  {copiedId === member.id ? (
                                    <Check className="w-3 h-3 text-green-500 ml-1 shrink-0" />
                                  ) : (
                                    <Copy className="w-3 h-3 opacity-0 md:group-hover:opacity-100 transition-opacity ml-1 shrink-0 text-muted-foreground" />
                                  )}
                                </div>
                              )}
                            </div>
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
                        <div className="mt-4">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3" />
                            Current Company
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {member.current_company}
                          </p>
                        </div>
                      )}

                      {member.target_roles && member.target_roles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" />
                            Target Roles
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {member.target_roles.slice(0, 3).map((role, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-secondary/50 hover:bg-secondary">
                                {role}
                              </Badge>
                            ))}
                            {member.target_roles.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-secondary/50 hover:bg-secondary">
                                +{member.target_roles.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {member.bio && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {member.bio}
                          </p>
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

      <MemberProfileModal 
        member={selectedMember} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default MembersPage;

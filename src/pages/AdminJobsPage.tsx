import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, ExternalLink, Users, Send, Eye, EyeOff, Star } from "lucide-react";
import { format } from "date-fns";

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
  is_active: boolean;
  is_featured: boolean;
  posted_by: string | null;
  created_at: string;
}

interface MatchingUser {
  user_id: string;
  email: string;
  full_name: string;
  match_score: number;
}

const JOB_TYPES = [
  { value: "internship", label: "Internship" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
];

const INDUSTRIES = [
  { value: "tech", label: "Technology" },
  { value: "consulting", label: "Consulting" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail / E-commerce" },
  { value: "media", label: "Media / Entertainment" },
  { value: "education", label: "Education" },
  { value: "saas", label: "SaaS" },
  { value: "consumer", label: "Consumer Products" },
  { value: "enterprise", label: "Enterprise Software" },
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

const COMPANY_SIZES = [
  { value: "startup", label: "Startup" },
  { value: "mid-size", label: "Mid-size" },
  { value: "enterprise", label: "Enterprise" },
];

const emptyJob = {
  title: "",
  company: "",
  description: "",
  url: "",
  job_type: "",
  industry: "",
  location: "",
  company_size: "",
  salary_range: "",
  deadline: "",
  is_active: true,
  is_featured: false,
};

const AdminJobsPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [formData, setFormData] = useState<typeof emptyJob>({ ...emptyJob });
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [matchingUsersJobId, setMatchingUsersJobId] = useState<string | null>(null);
  const [matchingUsers, setMatchingUsers] = useState<MatchingUser[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadJobs();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadJobs = async () => {
    setLoadingJobs(true);
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading jobs", error);
      toast({
        title: "Error loading jobs",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      setJobs(data ?? []);
    }
    setLoadingJobs(false);
  };

  const openAddSheet = () => {
    setEditingJob(null);
    setFormData({ ...emptyJob });
    setSheetOpen(true);
  };

  const openEditSheet = (job: JobPosting) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description ?? "",
      url: job.url,
      job_type: job.job_type ?? "",
      industry: job.industry ?? "",
      location: job.location ?? "",
      company_size: job.company_size ?? "",
      salary_range: job.salary_range ?? "",
      deadline: job.deadline ?? "",
      is_active: job.is_active,
      is_featured: job.is_featured,
    });
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingJob(null);
    setFormData({ ...emptyJob });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      company: formData.company,
      description: formData.description || null,
      url: formData.url,
      job_type: formData.job_type || null,
      industry: formData.industry || null,
      location: formData.location || null,
      company_size: formData.company_size || null,
      salary_range: formData.salary_range || null,
      deadline: formData.deadline || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      posted_by: user?.id,
    };

    if (editingJob) {
      setSavingId(editingJob.id);
      const { error } = await supabase
        .from("job_postings")
        .update(payload)
        .eq("id", editingJob.id);

      if (error) {
        toast({
          title: "Error saving job",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Job updated" });
        closeSheet();
        await loadJobs();
      }
      setSavingId(null);
    } else {
      setSavingId("create");
      const { error } = await supabase.from("job_postings").insert(payload);

      if (error) {
        toast({
          title: "Error creating job",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Job created" });
        closeSheet();
        await loadJobs();
      }
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("job_postings").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting job",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Job deleted" });
      await loadJobs();
    }
    setDeletingId(null);
    setDeleteJobId(null);
  };

  const toggleActive = async (job: JobPosting) => {
    const { error } = await supabase
      .from("job_postings")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);

    if (error) {
      toast({
        title: "Error updating job",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      await loadJobs();
    }
  };

  const viewMatchingUsers = async (jobId: string) => {
    setMatchingUsersJobId(jobId);
    setLoadingMatches(true);
    
    const { data, error } = await supabase
      .rpc("get_matching_users_for_job", { job_posting_id: jobId });

    if (error) {
      console.error("Error getting matching users:", error);
      toast({
        title: "Error loading matches",
        description: error.message,
        variant: "destructive",
      });
      setMatchingUsers([]);
    } else {
      setMatchingUsers(data ?? []);
    }
    setLoadingMatches(false);
  };

  const notifyMatchingUsers = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const usersToNotify = matchingUsers.filter((u) => u.match_score > 0);
    
    if (usersToNotify.length === 0) {
      toast({
        title: "No matching users",
        description: "No users match this job's criteria.",
        variant: "destructive",
      });
      return;
    }

    const notifications = usersToNotify.map((u) => ({
      user_id: u.user_id,
      job_id: jobId,
    }));

    const { error } = await supabase
      .from("job_notifications")
      .upsert(notifications, { onConflict: "user_id,job_id" });

    if (error) {
      toast({
        title: "Error sending notifications",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Notifications sent",
        description: `Notified ${usersToNotify.length} matching users about "${job.title}"`,
      });
    }
  };

  const isSaving = savingId !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Postings</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Post and manage job opportunities for PMA members.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
            <Button onClick={openAddSheet} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingJobs ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted/50 rounded-md animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No job postings yet.</p>
                <Button onClick={openAddSheet} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first job
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{job.title}</span>
                          {job.is_featured && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        {job.job_type && (
                          <Badge variant="outline">
                            {JOB_TYPES.find((t) => t.value === job.job_type)?.label ?? job.job_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {job.location && (
                          <span className="text-muted-foreground">
                            {LOCATIONS.find((l) => l.value === job.location)?.label ?? job.location}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {job.deadline && (
                          <span className="text-muted-foreground">
                            {format(new Date(job.deadline), "MMM d, yyyy")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={job.is_active ? "default" : "secondary"}>
                          {job.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => viewMatchingUsers(job.id)}
                            title="View matching users"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleActive(job)}
                            title={job.is_active ? "Deactivate" : "Activate"}
                          >
                            {job.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          {job.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a href={job.url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditSheet(job)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteJobId(job.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Job Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingJob ? "Edit Job" : "Add Job"}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Product Manager Intern"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Company *
              </label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google"
                required
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                Application URL *
              </label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the role..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="job_type" className="block text-sm font-medium mb-1">
                  Job Type
                </label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) => setFormData({ ...formData, job_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry
                </label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="company_size" className="block text-sm font-medium mb-1">
                  Company Size
                </label>
                <Select
                  value={formData.company_size}
                  onValueChange={(value) => setFormData({ ...formData, company_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salary_range" className="block text-sm font-medium mb-1">
                  Salary Range
                </label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="e.g., $80k-$100k"
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium mb-1">
                  Application Deadline
                </label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: Boolean(checked) })
                  }
                />
                <label htmlFor="is_active" className="text-sm">
                  Active (visible to members)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: Boolean(checked) })
                  }
                />
                <label htmlFor="is_featured" className="text-sm">
                  Featured (highlighted at top)
                </label>
              </div>
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeSheet}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingJob ? "Save" : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Matching Users Sheet */}
      <Sheet open={matchingUsersJobId !== null} onOpenChange={(open) => !open && setMatchingUsersJobId(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Matching Users</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            {loadingMatches ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted/50 rounded-md animate-pulse" />
                ))}
              </div>
            ) : matchingUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No users match this job's criteria.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {matchingUsers.length} user{matchingUsers.length !== 1 ? "s" : ""} match this job's criteria.
                </p>
                <div className="space-y-2 mb-6">
                  {matchingUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div>
                        <p className="font-medium">{user.full_name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.match_score >= 50 ? "default" : "secondary"}>
                        {user.match_score}% match
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => matchingUsersJobId && notifyMatchingUsers(matchingUsersJobId)}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Notify All Matching Users
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteJobId !== null}
        onOpenChange={(open) => !open && setDeleteJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job posting?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this job posting. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => deleteJobId && handleDelete(deleteJobId)}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminJobsPage;

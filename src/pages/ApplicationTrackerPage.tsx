import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Building2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import MemberLockout from "@/components/MemberLockout";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ApplicationStatus = 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';

const STATUS_COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: 'wishlist', title: 'Wishlist', color: 'border-slate-200 bg-slate-50 dark:bg-slate-900' },
  { id: 'applied', title: 'Applied', color: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' },
  { id: 'interviewing', title: 'Interviewing', color: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'offer', title: 'Offer 🥳', color: 'border-green-200 bg-green-50 dark:bg-green-900/20' },
  { id: 'rejected', title: 'Rejected', color: 'border-red-200 bg-red-50 dark:bg-red-900/20' },
];

interface JobApplication {
  id: string;
  user_id: string;
  job_posting_id?: string;
  company_name: string | null;
  job_title: string | null;
  status: ApplicationStatus;
  notes: string | null;
  applied_date: string | null;
  created_at: string;
  
  // Joined data from job_posting if it exists
  job_posting?: {
    company: string;
    title: string;
  };
}

const ApplicationTrackerPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    company_name: string;
    job_title: string;
    status: ApplicationStatus;
    notes: string;
  }>({
    company_name: '',
    job_title: '',
    status: 'wishlist',
    notes: ''
  });

  const isPmaMember = profile?.is_pma_member ?? false;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (isPmaMember) {
        loadApplications();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, user, isPmaMember, navigate]);

  const loadApplications = async () => {
    setLoading(true);
    // Left join with job_postings to get the title and company if it's linked
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_posting:job_postings(title, company)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error loading applications",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setApplications(data as JobApplication[]);
    }
    setLoading(false);
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    // Optimistic UI update
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));

    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
      // Revert optimism
      loadApplications();
    }
  };

  const openAddModal = () => {
    setFormData({
      company_name: '',
      job_title: '',
      status: 'wishlist',
      notes: ''
    });
    setEditingAppId(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (app: JobApplication) => {
    setEditingAppId(app.id);
    setFormData({
      company_name: app.job_posting?.company || app.company_name || '',
      job_title: app.job_posting?.title || app.job_title || '',
      status: app.status,
      notes: app.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const saveApplication = async () => {
    if (!user) return;
    if (!formData.company_name || !formData.job_title) {
      toast({ title: "Validation Error", description: "Company and Job Title are required", variant: "destructive" });
      return;
    }

    setSaving(true);

    if (editingAppId) {
      const { error } = await supabase
        .from('job_applications')
        .update({
          company_name: formData.company_name,
          job_title: formData.job_title,
          status: formData.status,
          notes: formData.notes
        })
        .eq('id', editingAppId);

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Application updated" });
        setIsEditModalOpen(false);
        loadApplications();
      }
    } else {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          company_name: formData.company_name,
          job_title: formData.job_title,
          status: formData.status,
          notes: formData.notes,
          applied_date: formData.status === 'applied' ? new Date().toISOString() : null
        });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Application added" });
        setIsAddModalOpen(false);
        loadApplications();
      }
    }
    
    setSaving(false);
  };

  const deleteApplication = async (appId: string) => {
    const { error } = await supabase.from('job_applications').delete().eq('id', appId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Application removed" });
      loadApplications();
    }
  };

  // Utility to get the display name (handles if it's from the external DB or manually added)
  const getDisplayCompany = (app: JobApplication) => app.job_posting?.company || app.company_name || "Unknown Company";
  const getDisplayTitle = (app: JobApplication) => app.job_posting?.title || app.job_title || "Unknown Role";

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPmaMember) {
    return <MemberLockout 
      description="The Application Tracker is an exclusive feature for PMA Members. Please join to track your internship progress!" 
      features={[
        "Organize your entire job search in one place",
        "Track interview stages and response dates",
        "Log company details and hiring manager contacts",
        "Visualize your recruiting funnel"
      ]}
    />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background overflow-x-hidden">
      <div className="container max-w-7xl mx-auto px-4">
        
        <AnimatedSection animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>
              <p className="text-muted-foreground">Manage and track your PM recruiting pipeline</p>
            </div>
            <Button onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Application
            </Button>
          </div>
        </AnimatedSection>

        {/* Kanban Board Layout */}
        <AnimatedSection animation="fade-in" delay={100} className="w-full">
          {/* Desktop Kanban View */}
          <div className="hidden md:flex gap-4 overflow-x-auto pb-4 snap-x">
            {STATUS_COLUMNS.map(col => {
              const colApps = applications.filter(a => a.status === col.id);
              return (
                <div key={col.id} className="shrink-0 w-[300px] snap-center">
                  <div className={`rounded-t-lg p-3 font-semibold text-sm border-t border-l border-r ${col.color}`}>
                    {col.title} <span className="text-muted-foreground ml-2">({colApps.length})</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-b-lg border-b border-l border-r min-h-[500px] flex flex-col gap-3">
                    
                    {colApps.map(app => (
                      <Card key={app.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm" onClick={() => openEditModal(app)}>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-sm leading-tight mb-1">{getDisplayTitle(app)}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mb-3">
                            <Building2 className="w-3 h-3 mr-1" />
                            {getDisplayCompany(app)}
                          </div>
                          
                          {/* Quick Status Select */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={app.status}
                              onValueChange={(val: ApplicationStatus) => handleStatusChange(app.id, val)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_COLUMNS.map(s => (
                                  <SelectItem key={s.id} value={s.id} className="text-xs">{s.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {colApps.length === 0 && (
                      <div className="text-center p-4 text-sm text-muted-foreground italic border border-dashed rounded-lg border-border">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Tabs View */}
          <div className="block md:hidden">
            <Tabs defaultValue="wishlist" className="w-full">
              <TabsList className="flex w-full overflow-x-auto no-scrollbar justify-start bg-transparent p-0 border-b border-border mb-4 h-auto">
                {STATUS_COLUMNS.map(col => {
                  const count = applications.filter(a => a.status === col.id).length;
                  return (
                    <TabsTrigger 
                      key={col.id} 
                      value={col.id}
                      className="shrink-0 px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {col.title} ({count})
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {STATUS_COLUMNS.map(col => {
                const colApps = applications.filter(a => a.status === col.id);
                return (
                  <TabsContent key={col.id} value={col.id} className="mt-0">
                    <div className="flex flex-col gap-3 pb-8">
                      {colApps.map(app => (
                        <Card key={app.id} className="cursor-pointer hover:border-primary/50 transition-colors shadow-sm" onClick={() => openEditModal(app)}>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-sm leading-tight mb-1">{getDisplayTitle(app)}</h3>
                            <div className="flex items-center text-xs text-muted-foreground mb-3">
                              <Building2 className="w-3 h-3 mr-1" />
                              {getDisplayCompany(app)}
                            </div>
                            
                            <div onClick={(e) => e.stopPropagation()}>
                              <Select
                                value={app.status}
                                onValueChange={(val: ApplicationStatus) => handleStatusChange(app.id, val)}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_COLUMNS.map(s => (
                                    <SelectItem key={s.id} value={s.id} className="text-xs">{s.title}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {colApps.length === 0 && (
                        <div className="text-center p-8 text-sm text-muted-foreground italic border border-dashed rounded-lg border-border mx-2">
                          No applications in {col.title}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </AnimatedSection>

        {/* Add/Edit Modal */}
        <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }
        }}>
          <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] p-4 md:p-6 max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle>{isEditModalOpen ? 'Edit Application' : 'Add Application'}</DialogTitle>
              <DialogDescription>
                Track the details of your job application here.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  placeholder="e.g. Google"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.job_title}
                  onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                  placeholder="e.g. Product Manager Intern"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v: ApplicationStatus) => setFormData({...formData, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_COLUMNS.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Private Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Link to job description, interview timeline, etc."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              {isEditModalOpen && editingAppId && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="mr-auto"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this application?")) {
                      deleteApplication(editingAppId);
                      setIsEditModalOpen(false);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              )}
              <Button type="submit" disabled={saving} onClick={saveApplication}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditModalOpen ? 'Save Changes' : 'Add to Tracker'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ApplicationTrackerPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import { ImageUploadWithCrop } from "@/components/ImageUploadWithCrop";
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
import { Pencil, Trash2, Plus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  priority: number | null;
}

const emptyMember = {
  name: "",
  position: "",
  bio: "",
  image_url: null as string | null,
  email: "",
  linkedin_url: "",
  priority: 0,
};

const AdminTeamPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<typeof emptyMember>({
    ...emptyMember,
  });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadMembers();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadMembers = async () => {
    setLoadingData(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, position, bio, image_url, email, linkedin_url, priority")
      .order("priority", { ascending: true });

    if (error) {
      console.error("Error loading team members", error);
      const friendlyMsg = getAdminErrorMessage(error);
      setLoadError(friendlyMsg);
      toast({
        title: "Error loading team members",
        description: friendlyMsg,
        variant: "destructive",
      });
    } else {
      setLoadError(null);
      setMembers(
        (data ?? []).map((m: any) => ({
          id: m.id,
          name: m.name,
          position: m.position,
          bio: m.bio,
          image_url: m.image_url,
          priority: m.priority,
        }))
      );
    }
    setLoadingData(false);
  };

  const openAddSheet = () => {
    setEditingMember(null);
    setFormData({ ...emptyMember });
    setSheetOpen(true);
  };

  const openEditSheet = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position ?? "",
      bio: member.bio ?? "",
      image_url: member.image_url,
      email: member.email ?? "",
      linkedin_url: member.linkedin_url ?? "",
      priority: member.priority ?? 0,
    });
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setEditingMember(null);
    setFormData({ ...emptyMember });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setSavingId(editingMember.id);
      const { error } = await supabase
        .from("team_members")
        .update({
          name: formData.name,
          position: formData.position || null,
          bio: formData.bio || null,
          image_url: formData.image_url,
          email: formData.email || null,
          linkedin_url: formData.linkedin_url || null,
          priority: formData.priority,
        })
        .eq("id", editingMember.id);

      if (error) {
        toast({
          title: "Error saving",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Saved", description: "Team member updated." });
        closeSheet();
        await loadMembers();
      }
      setSavingId(null);
    } else {
      setSavingId("create");
      const { error } = await supabase.from("team_members").insert({
        name: formData.name,
        position: formData.position || null,
        bio: formData.bio || null,
        image_url: formData.image_url,
        email: formData.email || null,
        linkedin_url: formData.linkedin_url || null,
        priority: formData.priority,
      });

      if (error) {
        toast({
          title: "Error creating",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Team member created", description: "The team member has been added." });
        closeSheet();
        await loadMembers();
      }
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Deleted", description: "Team member removed." });
      await loadMembers();
    }
    setDeletingId(null);
    setDeleteTargetId(null);
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
      <div className="container max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Members</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage the PMA team members that appear on the website.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openAddSheet} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Team Members</CardTitle>
            {loadError && (
              <Button variant="outline" size="sm" onClick={() => void loadMembers()}>
                Retry
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-muted/50 rounded-md animate-pulse"
                  />
                ))}
              </div>
            ) : loadError ? (
              <p className="py-8 text-center text-sm text-destructive">{loadError}</p>
            ) : members.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No team members yet.</p>
                <Button onClick={openAddSheet} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first member
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="w-20">Priority</TableHead>
                    <TableHead className="w-28 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                          {m.image_url ? (
                            <img
                              src={m.image_url}
                              alt={m.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                              —
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.position ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {m.priority ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditSheet(m)}
                            disabled={savingId === m.id || deletingId === m.id}
                            aria-label={`Edit ${m.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTargetId(m.id)}
                            disabled={savingId === m.id || deletingId === m.id}
                            aria-label={`Delete ${m.name}`}
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

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium mb-1">
                Position
              </label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Co-President"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                Bio
              </label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Short bio..."
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="member@byu.edu"
              />
            </div>
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium mb-1">
                LinkedIn URL
              </label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo</label>
              <ImageUploadWithCrop
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium mb-1">
                Priority
              </label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: Number(e.target.value) || 0 })
                }
                placeholder="Lower shows first"
              />
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeSheet}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingMember ? "Save" : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The team member will be removed from
              the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTeamPage;

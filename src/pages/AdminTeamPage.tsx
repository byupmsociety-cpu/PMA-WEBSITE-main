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

interface TeamMember {
  id: string;
  name: string;
  position: string | null;
  bio: string | null;
  image_url: string | null;
  priority: number | null;
}

const AdminTeamPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    priority: 0,
  });

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
      .select("id, name, position, bio, image_url, priority")
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const { error } = await supabase.from("team_members").insert({
      name: newMember.name,
      position: newMember.position || null,
      bio: newMember.bio || null,
      image_url: newMember.image_url || null,
      priority: newMember.priority,
    });

    if (error) {
      toast({
        title: "Error creating member",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Team member created",
        description: "The team member has been added.",
      });
      setNewMember({
        name: "",
        position: "",
        bio: "",
        image_url: "",
        priority: 0,
      });
      await loadMembers();
    }

    setCreating(false);
  };

  const handleUpdate = async (member: TeamMember) => {
    setSavingId(member.id);
    const { error } = await supabase
      .from("team_members")
      .update({
        name: member.name,
        position: member.position,
        bio: member.bio,
        image_url: member.image_url,
        priority: member.priority,
      })
      .eq("id", member.id);

    if (error) {
      toast({
        title: "Error saving member",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Team member updated.",
      });
      await loadMembers();
    }

    setSavingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting member",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Team member removed.",
      });
      await loadMembers();
    }
    setDeletingId(null);
  };

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
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Team Members</h1>
            <p className="text-muted-foreground text-sm">
              Manage the PMA team members that appear on the website.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <Input
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
              <Input
                placeholder="Position"
                value={newMember.position}
                onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
              />
              <Textarea
                placeholder="Short bio"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
              />
              <Input
                placeholder="Image URL"
                value={newMember.image_url}
                onChange={(e) => setNewMember({ ...newMember, image_url: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Priority (lower shows first)"
                value={newMember.priority}
                onChange={(e) =>
                  setNewMember({ ...newMember, priority: Number(e.target.value) || 0 })
                }
              />
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-destructive text-center">{loadError}</p>
              <Button variant="outline" size="sm" onClick={() => void loadMembers()}>
                Retry
              </Button>
            </div>
          ) : (
          <>
          {members.map((m) => (
            <Card key={m.id}>
              <CardContent className="pt-4 space-y-3">
                <Input
                  className="font-semibold"
                  value={m.name}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((row) =>
                        row.id === m.id ? { ...row, name: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  placeholder="Position"
                  value={m.position ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((row) =>
                        row.id === m.id ? { ...row, position: e.target.value } : row
                      )
                    )
                  }
                />
                <Textarea
                  placeholder="Bio"
                  value={m.bio ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((row) =>
                        row.id === m.id ? { ...row, bio: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  placeholder="Image URL"
                  value={m.image_url ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((row) =>
                        row.id === m.id ? { ...row, image_url: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="Priority"
                  value={m.priority ?? 0}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((row) =>
                        row.id === m.id
                          ? { ...row, priority: Number(e.target.value) || 0 }
                          : row
                      )
                    )
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(m)}
                    disabled={savingId === m.id || deletingId === m.id}
                  >
                    {savingId === m.id ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(m.id)}
                    disabled={savingId === m.id || deletingId === m.id}
                  >
                    {deletingId === m.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {members.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No team members yet. Add your first member above.
            </p>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTeamPage;


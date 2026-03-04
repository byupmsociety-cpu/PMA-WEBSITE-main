import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";

type Role = "super-admin" | "admin" | "member" | "guest";

interface AdminUserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  is_pma_member: boolean | null;
  is_blocked: boolean;
  deleted_at: string | null;
}

const AdminUsersPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [blockConfirm, setBlockConfirm] = useState<{ id: string; label: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUserRow | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadUsers();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadUsers = async () => {
    setLoadingData(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, is_pma_member, is_blocked, deleted_at")
      .is("deleted_at", null)
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Error loading users", error);
      const friendlyMsg = getAdminErrorMessage(error);
      setLoadError(friendlyMsg);
      toast({
        title: "Error loading users",
        description: friendlyMsg,
        variant: "destructive",
      });
    } else {
      setLoadError(null);
      const mapped: AdminUserRow[] =
        data?.map((row: any) => ({
          id: row.id,
          full_name: row.full_name,
          email: row.email,
          role: (row.role ?? "guest") as Role,
          is_pma_member: row.is_pma_member ?? null,
          is_blocked: row.is_blocked ?? false,
          deleted_at: row.deleted_at ?? null,
        })) ?? [];
      setRows(mapped);
    }
    setLoadingData(false);
  };

  const updateRole = async (id: string, newRole: Role) => {
    setSavingId(id);
    const is_pma_member = newRole !== "guest";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, is_pma_member })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating role",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}. PMA membership ${is_pma_member ? "enabled" : "disabled"}.`,
      });
      await loadUsers();
    }

    setSavingId(null);
  };

  const updateBlockedStatus = async (id: string, blocked: boolean) => {
    setSavingId(id);
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: blocked })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating status",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: blocked ? "User blocked" : "User unblocked",
        description: blocked
          ? "This user can no longer access the dashboard or member resources."
          : "This user can access the app again.",
      });
      await loadUsers();
    }

    setSavingId(null);
  };

  const softDeleteUser = (row: AdminUserRow) => {
    setDeleteConfirm(row);
  };

  const confirmSoftDelete = async () => {
    const row = deleteConfirm;
    if (!row) return;
    setDeleteConfirm(null);

    setSavingId(row.id);
    const { error } = await supabase
      .from("profiles")
      .update({
        is_blocked: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) {
      toast({
        title: "Error deleting profile",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile deleted",
        description: "The user's profile has been removed and they can no longer access the app.",
      });
      await loadUsers();
    }

    setSavingId(null);
  };

  const handlePromoteGuestToMember = async (row: AdminUserRow) => {
    if (row.role !== "guest") return;
    await updateRole(row.id, "member");
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
            <h1 className="text-2xl font-bold">Users & Roles</h1>
            <p className="text-muted-foreground text-sm">
              Super-admins can assign any role. Admins can assign admin, member, or guest (super-admin is super-admin only).
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>All Users</CardTitle>
            {loadError && (
              <Button variant="outline" size="sm" onClick={() => void loadUsers()}>
                Retry
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-2 overflow-x-auto">
            {loadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : loadError ? (
              <p className="py-4 text-center text-sm text-destructive">{loadError}</p>
            ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Role</th>
                  <th className="py-2 text-left">PMA Member</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2 pr-2">
                      {row.full_name || <span className="text-muted-foreground">Unknown</span>}
                    </td>
                    <td className="py-2 pr-2 font-mono text-xs">
                      {row.email || <span className="text-muted-foreground">N/A</span>}
                    </td>
                    <td className="py-2 pr-2">
                      {(isAdmin || isSuperAdmin) && (isSuperAdmin || row.role !== "super-admin") ? (
                        <Select
                          key={row.id + row.role}
                          defaultValue={row.role}
                          onValueChange={(val) => updateRole(row.id, val as Role)}
                          disabled={savingId === row.id}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {isSuperAdmin && (
                              <SelectItem value="super-admin">super-admin</SelectItem>
                            )}
                            <SelectItem value="admin">admin</SelectItem>
                            <SelectItem value="member">member</SelectItem>
                            <SelectItem value="guest">guest</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge>{row.role.toUpperCase()}</Badge>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      {row.is_pma_member ? (
                        <Badge variant="outline">PMA Member</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      {row.is_blocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground text-[11px]">Active</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={row.is_blocked ? "outline" : "destructive"}
                          onClick={() => {
                            if (!row.is_blocked) {
                              const label = row.full_name || row.email || "this user";
                              setBlockConfirm({ id: row.id, label });
                            } else {
                              void updateBlockedStatus(row.id, false);
                            }
                          }}
                          disabled={savingId === row.id}
                        >
                          {row.is_blocked ? "Unblock" : "Block"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromoteGuestToMember(row)}
                          disabled={savingId === row.id || row.role !== "guest"}
                        >
                          Promote to member
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => softDeleteUser(row)}
                          disabled={savingId === row.id}
                        >
                          Delete profile
                        </Button>
                        {savingId === row.id && (
                          <span className="text-xs text-muted-foreground">Saving...</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </CardContent>
        </Card>

        {/* Block confirmation */}
        <AlertDialog open={!!blockConfirm} onOpenChange={(open) => !open && setBlockConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Block access?</AlertDialogTitle>
              <AlertDialogDescription>
                Block access for {blockConfirm?.label ?? "this user"}? They will be unable to sign in
                or view member content until unblocked.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!savingId}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={!!savingId}
                onClick={(e) => {
                  e.preventDefault();
                  if (blockConfirm) {
                    void updateBlockedStatus(blockConfirm.id, true);
                    setBlockConfirm(null);
                  }
                }}
              >
                {savingId ? "Saving..." : "Block"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete profile confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete profile?</AlertDialogTitle>
              <AlertDialogDescription>
                Delete profile for {deleteConfirm?.full_name || deleteConfirm?.email || "this user"}?
                This will block access and hide them from the list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!savingId}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={!!savingId}
                onClick={(e) => {
                  e.preventDefault();
                  void confirmSoftDelete();
                }}
              >
                {savingId ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminUsersPage;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";

type Role = "super-admin" | "admin" | "user" | "guest";

interface AdminUserRow {
  id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  is_pma_member: boolean | null;
}

const AdminUsersPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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
      .select("id, full_name, email, role, is_pma_member")
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
      })) ?? [];
      setRows(mapped);
    }
    setLoadingData(false);
  };

  const updateRole = async (id: string, newRole: Role) => {
    setSavingId(id);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
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
        description: "User role has been updated.",
      });
      await loadUsers();
    }

    setSavingId(null);
  };

  const handlePromoteGuestToUser = async (row: AdminUserRow) => {
    if (row.role !== "guest") return;
    await updateRole(row.id, "user");
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
              Super-admins can assign any role. Admins can assign admin, user, or guest (super-admin is super-admin only).
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
                            <SelectItem value="user">user</SelectItem>
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
                      {savingId === row.id && (
                        <span className="text-xs text-muted-foreground">Saving...</span>
                      )}
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
      </div>
    </div>
  );
};

export default AdminUsersPage;


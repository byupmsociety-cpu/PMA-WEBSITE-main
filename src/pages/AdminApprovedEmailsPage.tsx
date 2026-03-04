import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";

type DefaultRole = "member" | "admin";

interface ApprovedEmailRow {
  id: string;
  email: string;
  default_role: DefaultRole;
  added_at: string;
  used_at: string | null;
  is_disabled: boolean;
}

const AdminApprovedEmailsPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rows, setRows] = useState<ApprovedEmailRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<DefaultRole>("member");
  const [saving, setSaving] = useState(false);
  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvRole, setCsvRole] = useState<DefaultRole>("member");
  const [uploadingCsv, setUploadingCsv] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadRows();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadRows = async () => {
    setLoadingData(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("approved_pma_members")
      .select("id, email, default_role, added_at, used_at, is_disabled")
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error loading approved emails", error);
      const friendlyMsg = getAdminErrorMessage(error);
      setLoadError(friendlyMsg);
      toast({
        title: "Error loading list",
        description: friendlyMsg,
        variant: "destructive",
      });
    } else {
      setLoadError(null);
      const mapped: ApprovedEmailRow[] =
        data?.map((row: any) => ({
          id: row.id,
          email: row.email,
          default_role: (row.default_role ?? "member") as DefaultRole,
          added_at: row.added_at,
          used_at: row.used_at ?? null,
          is_disabled: row.is_disabled ?? false,
        })) ?? [];
      setRows(mapped);
    }
    setLoadingData(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.toLowerCase().endsWith("@byu.edu")) {
      toast({
        title: "Invalid email",
        description: "Pre-approved emails must be @byu.edu addresses.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("approved_pma_members").insert({
      email: newEmail.toLowerCase(),
      default_role: newRole,
    });

    if (error) {
      toast({
        title: "Error adding email",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email added",
        description: "The email has been added to the pre-approved list.",
      });
      setNewEmail("");
      setNewRole("member");
      await loadRows();
    }

    setSaving(false);
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      toast({
        title: "No file selected",
        description: "Choose a CSV file with a header row containing an email column.",
        variant: "destructive",
      });
      return;
    }

    setUploadingCsv(true);
    try {
      const text = await csvFile.text();
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (lines.length <= 1) {
        toast({
          title: "CSV is empty",
          description: "The CSV must include a header row and at least one data row.",
          variant: "destructive",
        });
        return;
      }

      const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const emailIndex = header.findIndex((h) => h === "email" || h.includes("email"));

      if (emailIndex === -1) {
        toast({
          title: "Missing email column",
          description: "The first row must include a column named email.",
          variant: "destructive",
        });
        return;
      }

      const existingEmails = new Set(rows.map((row) => row.email.toLowerCase()));
      const newEmailSet = new Set<string>();

      for (const line of lines.slice(1)) {
        const cols = line.split(",");
        const rawEmail = (cols[emailIndex] ?? "").trim().toLowerCase();
        if (!rawEmail) continue;
        if (!rawEmail.endsWith("@byu.edu")) continue;
        if (existingEmails.has(rawEmail)) continue;
        newEmailSet.add(rawEmail);
      }

      if (newEmailSet.size === 0) {
        toast({
          title: "No new emails",
          description: "All valid @byu.edu emails in the CSV are already pre-approved.",
        });
        return;
      }

      const inserts = Array.from(newEmailSet).map((email) => ({
        email,
        default_role: csvRole,
      }));

      const { error } = await supabase.from("approved_pma_members").insert(inserts);

      if (error) {
        toast({
          title: "Error uploading CSV",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "CSV processed",
          description: `Added ${inserts.length} new pre-approved email${inserts.length === 1 ? "" : "s"}.`,
        });
        setCsvFile(null);
        setCsvRole("member");
        await loadRows();
      }
    } finally {
      setUploadingCsv(false);
    }
  };

  const handleUpdateDefaultRole = async (id: string, newRole: DefaultRole) => {
    setSavingRoleId(id);
    const { error } = await supabase
      .from("approved_pma_members")
      .update({ default_role: newRole })
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
        description: "Default role has been updated.",
      });
      await loadRows();
    }
    setSavingRoleId(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("approved_pma_members")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting email",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email removed",
        description: "The email has been removed from the list.",
      });
      await loadRows();
    }
  };

  const toggleDisabled = async (row: ApprovedEmailRow) => {
    const nextDisabled = !row.is_disabled;
    const { error } = await supabase
      .from("approved_pma_members")
      .update({ is_disabled: nextDisabled })
      .eq("id", row.id);

    if (error) {
      toast({
        title: "Error updating entry",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: nextDisabled ? "Entry disabled" : "Entry enabled",
        description: nextDisabled
          ? "This email will no longer be auto-approved on signup."
          : "This email can be auto-approved again on signup.",
      });
      await loadRows();
    }
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
      <div className="container max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Pre-approved Emails</h1>
            <p className="text-muted-foreground text-sm">
              Control which BYU emails are auto-approved as PMA users or admins on signup.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add Pre-approved Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="student@byu.edu"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <Select value={newRole} onValueChange={(val) => setNewRole(val as DefaultRole)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload from CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload a CSV with a header row that includes an <code>email</code> column
              (e.g. <code>Name,Email</code>). Only new <span className="font-mono">@byu.edu</span> addresses
              will be added; existing entries are left unchanged.
            </p>
            <form onSubmit={handleCsvUpload} className="flex flex-col sm:flex-row gap-3 items-start">
              <Input
                type="file"
                accept=".csv"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setCsvFile(file);
                }}
              />
              <Select value={csvRole} onValueChange={(val) => setCsvRole(val as DefaultRole)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={uploadingCsv}>
                {uploadingCsv ? "Uploading..." : "Upload CSV"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Current List</CardTitle>
            {loadError && (
              <Button variant="outline" size="sm" onClick={() => void loadRows()}>
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
                  <th className="py-2 text-left">Email</th>
                  <th className="py-2 text-left">Default Role</th>
                  <th className="py-2 text-left">Added</th>
                  <th className="py-2 text-left">Used</th>
                  <th className="py-2 text-left">Status</th>
                  <th className="py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-2 pr-2 font-mono text-xs">{row.email}</td>
                    <td className="py-2 pr-2">
                      <Select
                        value={row.default_role}
                        onValueChange={(val) => handleUpdateDefaultRole(row.id, val as DefaultRole)}
                        disabled={savingRoleId === row.id}
                      >
                        <SelectTrigger className="h-8 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">member</SelectItem>
                          <SelectItem value="admin">admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 pr-2 text-xs text-muted-foreground">
                      {new Date(row.added_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 pr-2 text-xs">
                      {row.used_at ? (
                        <span className="text-muted-foreground">
                          {new Date(row.used_at).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not yet</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      {row.is_disabled ? (
                        <Badge variant="destructive">Disabled</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground text-[11px]">Active</span>
                      )}
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant={row.is_disabled ? "outline" : "destructive"}
                          onClick={() => toggleDisabled(row)}
                          disabled={savingRoleId === row.id}
                        >
                          {row.is_disabled ? "Enable" : "Disable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(row.id)}
                          disabled={savingRoleId === row.id}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground text-sm">
                      No pre-approved emails yet.
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

export default AdminApprovedEmailsPage;


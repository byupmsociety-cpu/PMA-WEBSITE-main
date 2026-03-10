import { useEffect, useState } from "react";
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

export default function ApprovedEmailsPanel() {
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
    void loadRows();
  }, []);

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
      
      // Robustly parse the CSV handling quoted strings
      const parseCsvRow = (line: string) => {
        return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g, '').trim());
      };

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

      const header = parseCsvRow(lines[0]).map((h) => h.toLowerCase());
      const emailIndex = header.findIndex((h) => h === "email" || h.includes("email"));
      const statusIndex = header.findIndex((h) => h === "status" || h.includes("status"));

      if (emailIndex === -1) {
        toast({
          title: "Missing email column",
          description: "The first row must include a column named email.",
          variant: "destructive",
        });
        return;
      }

      const existingEmailsMap = new Map<string, ApprovedEmailRow>();
      rows.forEach((row) => existingEmailsMap.set(row.email.toLowerCase(), row));

      const emailsToAdd = new Set<string>();
      const emailsToEnable = new Set<string>();
      const emailsToDisable = new Set<string>();

      for (const line of lines.slice(1)) {
        const cols = parseCsvRow(line);
        const rawEmail = (cols[emailIndex] ?? "").trim().toLowerCase();
        
        if (!rawEmail || !rawEmail.endsWith("@byu.edu")) continue;

        const statusRaw = statusIndex !== -1 ? (cols[statusIndex] || "").trim().toLowerCase() : "active";
        const isGrantedAccess = statusRaw === "active" || statusRaw === "approved";
        
        const existingRow = existingEmailsMap.get(rawEmail);

        if (isGrantedAccess) {
          if (!existingRow) {
            emailsToAdd.add(rawEmail);
          } else if (existingRow.is_disabled) {
            emailsToEnable.add(rawEmail);
          }
        } else {
          // Status is inactive, requested, etc.
          if (existingRow && !existingRow.is_disabled) {
            emailsToDisable.add(rawEmail);
          }
        }
      }

      if (emailsToAdd.size === 0 && emailsToEnable.size === 0 && emailsToDisable.size === 0) {
        toast({
          title: "No changes needed",
          description: "All valid @byu.edu users in the CSV are already up to date.",
        });
        return;
      }

      let appliedChanges = false;
      let hasError = false;

      // 1. Add new users
      if (emailsToAdd.size > 0) {
        const inserts = Array.from(emailsToAdd).map((email) => ({
          email,
          default_role: csvRole,
        }));
        const { error } = await supabase.from("approved_pma_members").insert(inserts);
        if (error) {
          hasError = true;
          toast({
            title: "Error adding users",
            description: getAdminErrorMessage(error),
            variant: "destructive",
          });
        } else {
          appliedChanges = true;
        }
      }

      // 2. Enable existing users
      if (emailsToEnable.size > 0) {
        const { error } = await supabase
          .from("approved_pma_members")
          .update({ is_disabled: false })
          .in("email", Array.from(emailsToEnable));
        
        if (error) {
          hasError = true;
          toast({
            title: "Error enabling users",
            description: getAdminErrorMessage(error),
            variant: "destructive",
          });
        } else {
          appliedChanges = true;
        }
      }

      // 3. Disable inactive/requested users
      if (emailsToDisable.size > 0) {
        const { error } = await supabase
          .from("approved_pma_members")
          .update({ is_disabled: true })
          .in("email", Array.from(emailsToDisable));
        
        if (error) {
          hasError = true;
          toast({
            title: "Error disabling users",
            description: getAdminErrorMessage(error),
            variant: "destructive",
          });
        } else {
          appliedChanges = true;
        }
      }

      if (appliedChanges && !hasError) {
        toast({
          title: "CSV processing complete",
          description: `Added ${emailsToAdd.size}, enabled ${emailsToEnable.size}, disabled ${emailsToDisable.size} users.`,
        });
        setCsvFile(null);
        setCsvRole("member");
        await loadRows();
      } else if (appliedChanges && hasError) {
        // Partial success
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
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
            <CardTitle>Bulk Upload (CSV)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              Upload a CSV with a header row containing an <code>email</code> column.
              If a <code>status</code> column is present, users marked as <strong>Active/Approved</strong> will be added or enabled, while <strong>Inactive/Requested</strong> users will have their access disabled. Only <span className="font-mono">@byu.edu</span> addresses are processed.
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
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Current List</CardTitle>
          {loadError ? (
            <Button variant="outline" size="sm" onClick={() => void loadRows()}>
              Retry
            </Button>
          ) : null}
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
                    <td colSpan={6} className="py-4 text-center text-muted-foreground text-sm">
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
  );
}


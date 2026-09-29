import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import {
  applyRosterSync,
  fetchAllProfiles,
  parseRosterFile,
  planRosterSync,
  syncAccountsForEmail,
  type DefaultRole,
  type ParsedRoster,
  type SyncChange,
  type SyncPlan,
} from "@/lib/rosterSync";

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
  const [rosterFile, setRosterFile] = useState<File | null>(null);
  const [rosterRole, setRosterRole] = useState<DefaultRole>("member");
  const [previewing, setPreviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [roster, setRoster] = useState<ParsedRoster | null>(null);
  const [plan, setPlan] = useState<SyncPlan | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

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
      const upgraded = await syncAccountsSafely(newEmail.toLowerCase(), newRole);
      toast({
        title: "Email added",
        description:
          upgraded > 0
            ? "Added to the pre-approved list, and their existing account now has member access."
            : "The email has been added to the pre-approved list.",
      });
      setNewEmail("");
      setNewRole("member");
      await loadRows();
    }

    setSaving(false);
  };

  // Returns how many accounts changed; failures are reported but don't undo the list change
  const syncAccountsSafely = async (email: string, approvedRole: DefaultRole | null) => {
    try {
      return await syncAccountsForEmail(email, approvedRole);
    } catch (error) {
      toast({
        title: "List updated, but the account wasn't",
        description: getAdminErrorMessage(error as { message: string }),
        variant: "destructive",
      });
      return 0;
    }
  };

  const resetRoster = () => {
    setRosterFile(null);
    setRoster(null);
    setPlan(null);
    setRosterRole("member");
    setFileInputKey((k) => k + 1);
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rosterFile) {
      toast({
        title: "No file selected",
        description: "Choose the BYU Clubs member export (.xls) or a CSV with an email column.",
        variant: "destructive",
      });
      return;
    }

    setPreviewing(true);
    try {
      const parsed = await parseRosterFile(rosterFile);
      const profiles = await fetchAllProfiles();
      setRoster(parsed);
      setPlan(planRosterSync(parsed.entries, rows, profiles, rosterRole));
    } catch (error) {
      setRoster(null);
      setPlan(null);
      toast({
        title: "Couldn't read that file",
        description: error instanceof Error ? error.message : getAdminErrorMessage(error as { message: string }),
        variant: "destructive",
      });
    } finally {
      setPreviewing(false);
    }
  };

  const handleApply = async () => {
    if (!plan) return;
    setApplying(true);
    try {
      const errors = await applyRosterSync(plan, rosterRole);
      if (errors.length === 0) {
        toast({
          title: "Roster synced",
          description: `${plan.accountUpgrade.length} account(s) upgraded, ${plan.accountDowngrade.length} moved to guest; list: ${plan.listAdd.length} added, ${plan.listEnable.length} re-enabled, ${plan.listDisable.length} disabled.`,
        });
      } else {
        toast({
          title: "Some changes failed",
          description: errors.join(" · "),
          variant: "destructive",
        });
      }
      resetRoster();
      await loadRows();
    } finally {
      setApplying(false);
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

  const handleDelete = async (row: ApprovedEmailRow) => {
    const id = row.id;
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
      const downgraded = await syncAccountsSafely(row.email, null);
      toast({
        title: "Email removed",
        description:
          downgraded > 0
            ? "Removed from the list, and their account was moved back to guest."
            : "The email has been removed from the list.",
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
      const changed = await syncAccountsSafely(row.email, nextDisabled ? null : row.default_role);
      toast({
        title: nextDisabled ? "Entry disabled" : "Entry enabled",
        description: nextDisabled
          ? `This email will no longer be auto-approved${changed > 0 ? ", and their account was moved back to guest" : ""}.`
          : `This email is approved again${changed > 0 ? ", and their existing account now has member access" : ""}.`,
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
            <CardTitle>Sync from BYU Clubs Roster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Upload the member export from BYU Clubs (<code>.xls</code>) as-is. Anyone with unexpired dues, plus
              officers, gets access; everyone else in the file loses it. Existing accounts are updated too. People
              not in the file, admins, and blocked accounts are never changed. A plain CSV with an{" "}
              <code>email</code> column (and optional <code>status</code> column) also works. You'll see a preview
              before anything is saved.
            </p>
            <form onSubmit={handlePreview} className="flex flex-col sm:flex-row gap-3 items-start">
              <Input
                key={fileInputKey}
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={(event) => {
                  setRosterFile(event.target.files?.[0] ?? null);
                  setRoster(null);
                  setPlan(null);
                }}
              />
              <Select value={rosterRole} onValueChange={(val) => setRosterRole(val as DefaultRole)}>
                <SelectTrigger className="w-full sm:w-40" aria-label="Role for new entries">
                  <SelectValue placeholder="Default role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">member</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={previewing || applying}>
                {previewing ? "Reading..." : "Preview changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {plan && roster && (
        <RosterPreview
          plan={plan}
          roster={roster}
          applying={applying}
          onApply={() => void handleApply()}
          onCancel={resetRoster}
        />
      )}

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
                          onClick={() => handleDelete(row)}
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

const RosterChangeList = ({
  title,
  changes,
  tone,
}: {
  title: string;
  changes: SyncChange[];
  tone: "add" | "remove";
}) => {
  if (changes.length === 0) return null;
  const countClass = tone === "add" ? "text-green-700 dark:text-green-400" : "text-destructive";
  return (
    <details className="rounded-lg border border-border px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium">
        <span className={countClass}>{changes.length}</span> {title}
      </summary>
      <ul className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
        {changes.map((c) => (
          <li key={c.email} className="text-xs flex flex-wrap gap-x-2">
            <span className="font-medium">{c.name || c.email}</span>
            {c.name && <span className="font-mono text-muted-foreground">{c.email}</span>}
            <span className="text-muted-foreground">· {c.reason}</span>
          </li>
        ))}
      </ul>
    </details>
  );
};

const RosterPreview = ({
  plan,
  roster,
  applying,
  onApply,
  onCancel,
}: {
  plan: SyncPlan;
  roster: ParsedRoster;
  applying: boolean;
  onApply: () => void;
  onCancel: () => void;
}) => {
  const paid = roster.entries.filter((e) => e.paid).length;
  const totalChanges =
    plan.listAdd.length +
    plan.listEnable.length +
    plan.listDisable.length +
    plan.accountUpgrade.length +
    plan.accountDowngrade.length;
  const modeLabel =
    roster.mode === "dues"
      ? "unexpired dues or officer"
      : roster.mode === "status"
        ? "Status is Active or Approved"
        : "everyone listed";

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <p className="text-sm text-muted-foreground">
          {roster.entries.length} BYU emails in the file, {paid} count as paid ({modeLabel}).
          {roster.skippedNonByu > 0 && ` ${roster.skippedNonByu} non-BYU emails skipped.`} Nothing has been saved yet.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalChanges === 0 ? (
          <p className="text-sm">Everything already matches this roster. No changes needed.</p>
        ) : (
          <>
            <RosterChangeList title="existing accounts get member access" changes={plan.accountUpgrade} tone="add" />
            <RosterChangeList title="existing accounts lose member access" changes={plan.accountDowngrade} tone="remove" />
            <RosterChangeList title="emails added to the pre-approved list" changes={plan.listAdd} tone="add" />
            <RosterChangeList title="list entries re-enabled" changes={plan.listEnable} tone="add" />
            <RosterChangeList title="list entries disabled" changes={plan.listDisable} tone="remove" />
          </>
        )}
        <p className="text-xs text-muted-foreground">{plan.unchanged} people in the file are already up to date.</p>
        <div className="flex gap-3 pt-2">
          <Button onClick={onApply} disabled={applying || totalChanges === 0}>
            {applying ? "Applying..." : `Apply ${totalChanges} change${totalChanges === 1 ? "" : "s"}`}
          </Button>
          <Button variant="outline" onClick={onCancel} disabled={applying}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

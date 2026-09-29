import { supabase } from "@/integrations/supabase/client";

/**
 * Roster sync: turn a BYU Clubs member export (or a plain email CSV) into
 * changes to the pre-approved list AND to existing accounts.
 *
 * Who counts as paid, per row:
 *   - Export has a "Dues Expiration Date" column -> dues expire in the future,
 *     or the row has an Officer title.
 *   - Otherwise, export has a "Status" column    -> Active / Approved.
 *   - Otherwise (plain email list)               -> everyone listed.
 * People who aren't in the file are never touched, and admin / super-admin,
 * blocked, or deleted accounts are never changed.
 */

export type DefaultRole = "member" | "admin";

export interface ApprovedListRow {
  id: string;
  email: string;
  default_role: DefaultRole;
  is_disabled: boolean;
}

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  is_blocked: boolean | null;
  deleted_at: string | null;
}

export interface RosterEntry {
  email: string;
  name: string;
  paid: boolean;
  reason: string;
}

export interface ParsedRoster {
  entries: RosterEntry[];
  mode: "dues" | "status" | "email-only";
  skippedNonByu: number;
}

export interface SyncChange {
  email: string;
  name: string;
  reason: string;
}

export interface SyncPlan {
  listAdd: SyncChange[];
  listEnable: (SyncChange & { id: string })[];
  listDisable: (SyncChange & { id: string })[];
  accountUpgrade: (SyncChange & { profileId: string; role: DefaultRole })[];
  accountDowngrade: (SyncChange & { profileId: string })[];
  unchanged: number;
}

const normalizeHeader = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "");

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "string" && value.trim()) {
    const d = new Date(value.trim().replace(" ", "T"));
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

const formatDate = (d: Date) => d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

/** Read a .xls / .xlsx / .csv roster file into classified entries. */
export async function parseRosterFile(file: File, now: Date = new Date()): Promise<ParsedRoster> {
  // Loaded on demand so the spreadsheet parser only ships to admins who upload
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(await file.arrayBuffer(), { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

  if (rawRows.length === 0) {
    throw new Error("The file has no data rows.");
  }

  const headers = Object.keys(rawRows[0]);
  const find = (...names: string[]) =>
    headers.find((h) => names.includes(normalizeHeader(h))) ??
    headers.find((h) => names.some((n) => normalizeHeader(h).includes(n)));

  const emailCol = find("email", "emailaddress");
  if (!emailCol) {
    throw new Error("Couldn't find an email column in the file.");
  }
  const duesCol = find("duesexpirationdate", "duesexpiration");
  const officerCol = find("officer");
  const statusCol = find("status");
  const firstCol = find("firstname");
  const lastCol = find("lastname");

  const mode: ParsedRoster["mode"] = duesCol ? "dues" : statusCol ? "status" : "email-only";

  const byEmail = new Map<string, RosterEntry>();
  let skippedNonByu = 0;

  for (const row of rawRows) {
    const email = String(row[emailCol] ?? "").trim().toLowerCase();
    if (!email) continue;
    if (!email.endsWith("@byu.edu")) {
      skippedNonByu++;
      continue;
    }

    const name = [firstCol && row[firstCol], lastCol && row[lastCol]]
      .map((v) => String(v ?? "").trim())
      .filter(Boolean)
      .join(" ");

    let paid: boolean;
    let reason: string;
    if (mode === "dues") {
      const officer = officerCol ? String(row[officerCol] ?? "").replace(/^\*/, "").trim() : "";
      const expires = toDate(row[duesCol!]);
      if (expires && expires > now) {
        paid = true;
        reason = `Dues paid through ${formatDate(expires)}`;
      } else if (officer) {
        paid = true;
        reason = `Officer (${officer})`;
      } else {
        paid = false;
        reason = expires ? `Dues expired ${formatDate(expires)}` : "No dues on record";
      }
    } else if (mode === "status") {
      const status = String(row[statusCol!] ?? "").trim();
      paid = ["active", "approved"].includes(status.toLowerCase());
      reason = `Status: ${status || "blank"}`;
    } else {
      paid = true;
      reason = "Listed in file";
    }

    // If an email appears twice, a paid row wins
    const existing = byEmail.get(email);
    if (!existing || (!existing.paid && paid)) {
      byEmail.set(email, { email, name, paid, reason });
    }
  }

  return { entries: [...byEmail.values()], mode, skippedNonByu };
}

/** Work out what an upload would change, without changing anything. */
export function planRosterSync(
  roster: RosterEntry[],
  approvedRows: ApprovedListRow[],
  profiles: ProfileRow[],
  newEntryRole: DefaultRole,
): SyncPlan {
  const listByEmail = new Map(approvedRows.map((r) => [r.email.toLowerCase(), r]));
  const profilesByEmail = new Map<string, ProfileRow[]>();
  for (const p of profiles) {
    if (!p.email) continue;
    const key = p.email.toLowerCase();
    profilesByEmail.set(key, [...(profilesByEmail.get(key) ?? []), p]);
  }

  const plan: SyncPlan = {
    listAdd: [],
    listEnable: [],
    listDisable: [],
    accountUpgrade: [],
    accountDowngrade: [],
    unchanged: 0,
  };

  for (const entry of roster) {
    const change = { email: entry.email, name: entry.name, reason: entry.reason };
    const listRow = listByEmail.get(entry.email);
    let changed = false;

    if (entry.paid) {
      if (!listRow) {
        plan.listAdd.push(change);
        changed = true;
      } else if (listRow.is_disabled) {
        plan.listEnable.push({ ...change, id: listRow.id });
        changed = true;
      }
    } else if (listRow && !listRow.is_disabled) {
      plan.listDisable.push({ ...change, id: listRow.id });
      changed = true;
    }

    for (const profile of profilesByEmail.get(entry.email) ?? []) {
      if (profile.is_blocked || profile.deleted_at) continue;
      if (entry.paid && profile.role === "guest") {
        plan.accountUpgrade.push({
          ...change,
          name: entry.name || profile.full_name || "",
          profileId: profile.id,
          role: listRow?.default_role ?? newEntryRole,
        });
        changed = true;
      } else if (!entry.paid && profile.role === "member") {
        plan.accountDowngrade.push({ ...change, name: entry.name || profile.full_name || "", profileId: profile.id });
        changed = true;
      }
    }

    if (!changed) plan.unchanged++;
  }

  return plan;
}

/** Load every profile (paged past the API's 1000-row default). Admin-only by RLS. */
export async function fetchAllProfiles(): Promise<ProfileRow[]> {
  const pageSize = 1000;
  const all: ProfileRow[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_blocked, deleted_at")
      .range(from, from + pageSize - 1);
    if (error) throw error;
    all.push(...((data ?? []) as ProfileRow[]));
    if (!data || data.length < pageSize) return all;
  }
}

/**
 * Bring existing accounts for one email in line with its approval. Used by the
 * single-email add / enable / disable / remove buttons.
 */
export async function syncAccountsForEmail(email: string, approvedRole: DefaultRole | null) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, is_blocked, deleted_at")
    .ilike("email", email.replace(/[%_\\]/g, "\\$&"));
  if (error) throw error;

  const eligible = (data ?? []).filter((p) => !p.is_blocked && !p.deleted_at);
  const ids = approvedRole
    ? eligible.filter((p) => p.role === "guest").map((p) => p.id)
    : eligible.filter((p) => p.role === "member").map((p) => p.id);
  if (ids.length === 0) return 0;

  const { error: updateError } = await supabase
    .from("profiles")
    .update(
      approvedRole
        ? { role: approvedRole, is_pma_member: true, membership_verified_at: new Date().toISOString() }
        : { role: "guest", is_pma_member: false },
    )
    .in("id", ids);
  if (updateError) throw updateError;
  return ids.length;
}

/** Apply a previewed plan. Returns how many steps failed (0 = all good). */
export async function applyRosterSync(plan: SyncPlan, newEntryRole: DefaultRole): Promise<string[]> {
  const errors: string[] = [];
  const run = async (label: string, op: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await op;
    if (error) errors.push(`${label}: ${error.message}`);
  };

  if (plan.listAdd.length) {
    await run(
      "Adding approved emails",
      supabase.from("approved_pma_members").insert(plan.listAdd.map((c) => ({ email: c.email, default_role: newEntryRole }))),
    );
  }
  if (plan.listEnable.length) {
    await run(
      "Re-enabling approved emails",
      supabase.from("approved_pma_members").update({ is_disabled: false }).in("id", plan.listEnable.map((c) => c.id)),
    );
  }
  if (plan.listDisable.length) {
    await run(
      "Disabling approved emails",
      supabase.from("approved_pma_members").update({ is_disabled: true }).in("id", plan.listDisable.map((c) => c.id)),
    );
  }

  const verifiedAt = new Date().toISOString();
  for (const role of ["member", "admin"] as const) {
    const ids = plan.accountUpgrade.filter((c) => c.role === role).map((c) => c.profileId);
    if (ids.length) {
      await run(
        `Upgrading accounts to ${role}`,
        supabase.from("profiles").update({ role, is_pma_member: true, membership_verified_at: verifiedAt }).in("id", ids),
      );
    }
  }
  if (plan.accountDowngrade.length) {
    await run(
      "Moving accounts back to guest",
      supabase
        .from("profiles")
        .update({ role: "guest", is_pma_member: false })
        .in("id", plan.accountDowngrade.map((c) => c.profileId)),
    );
  }

  return errors;
}

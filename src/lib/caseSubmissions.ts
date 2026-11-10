import { supabase } from "@/integrations/supabase/client";

export type CaseTrack = "chat" | "prototype" | "pull_request";

export interface CaseSubmission {
  teamName: string;
  members: string;
  problem: string;
  workUrl: string;
  track: CaseTrack;
  notes: string;
}

export function normalizeUrl(url: string) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function submitCaseEntry(entry: CaseSubmission) {
  // case_submissions isn't in the generated types yet, so the table name is cast.
  const { error } = await supabase.from("case_submissions" as never).insert({
    team_name: entry.teamName.trim().slice(0, 100),
    members: entry.members.trim().slice(0, 500),
    problem: entry.problem.trim().slice(0, 2000),
    work_url: normalizeUrl(entry.workUrl).slice(0, 500),
    track: entry.track,
    notes: entry.notes.trim().slice(0, 2000) || null,
  } as never);
  if (error) throw error;
}

import { z } from "zod";

export interface AdminEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  is_public: boolean;
  registration_link: string | null;
  image_url: string | null;
}

export type TimeFilter = "upcoming" | "past" | "all";
export type StatusFilter = "all" | "published" | "draft";
export type SortDirection = "asc" | "desc";

export interface EventSuggestion {
  id: string;
  title: string;
  description: string | null;
  submitter_email: string | null;
  created_at: string;
  read_at: string | null;
}

export const eventFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().optional(),
    location: z.string().optional(),
    registration_link: z
      .string()
      .url("Registration link must be a valid URL")
      .optional()
      .or(z.literal("")),
    is_public: z.boolean(),
    event_type: z.enum(["in_person", "virtual"]),
  })
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return true;
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start;
    },
    {
      message: "End time must be the same as or after start time",
      path: ["end_time"],
    }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function fromLocalInputValue(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

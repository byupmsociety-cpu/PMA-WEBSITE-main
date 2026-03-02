import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
import { Badge } from "@/components/ui/badge";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpDown, Calendar, Clock, Edit2, ExternalLink, Plus, Trash2 } from "lucide-react";

interface AdminEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  is_public: boolean;
  registration_link: string | null;
}

type TimeFilter = "upcoming" | "past" | "all";
type StatusFilter = "all" | "published" | "draft";
type SortDirection = "asc" | "desc";

const eventFormSchema = z
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

type EventFormValues = z.infer<typeof eventFormSchema>;

function toLocalInputValue(iso: string | null): string {
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

function fromLocalInputValue(value: string | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

const AdminEventsPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [startTimeOnly, setStartTimeOnly] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [endTimeOnly, setEndTimeOnly] = useState<string>("");
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      location: "",
      registration_link: "",
      is_public: true,
      event_type: "in_person",
    },
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadEvents();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadEvents = async () => {
    setLoadingData(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, start_time, end_time, location, is_public, registration_link")
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Error loading events", error);
      const friendlyMsg = getAdminErrorMessage(error);
      setLoadError(friendlyMsg);
      toast({
        title: "Error loading events",
        description: friendlyMsg,
        variant: "destructive",
      });
    } else {
      setLoadError(null);
      setEvents(
      (data ?? []).map((e: any) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location,
        is_public: e.is_public,
        registration_link: e.registration_link,
      }))
      );
    }
    setLoadingData(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    // kept only to satisfy existing references; create is now handled via form submit
  };

  const openCreateSheet = () => {
    setEditingEvent(null);
    form.reset({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      location: "",
      registration_link: "",
      is_public: true,
      event_type: "in_person",
    });
    setStartDate("");
    setStartTimeOnly("");
    setEndDate("");
    setEndTimeOnly("");
    setSheetOpen(true);
  };

  const openEditSheet = (evt: AdminEvent) => {
    setEditingEvent(evt);
    const localStart = toLocalInputValue(evt.start_time);
    const localEnd = toLocalInputValue(evt.end_time);
    const [startDatePart, startTimePart] = localStart ? localStart.split("T") : ["", ""];
    const [endDatePart, endTimePart] = localEnd ? localEnd.split("T") : ["", ""];
    setStartDate(startDatePart ?? "");
    setStartTimeOnly(startTimePart ?? "");
    setEndDate(endDatePart ?? "");
    setEndTimeOnly(endTimePart ?? "");
    const inferredType = evt.registration_link ? "virtual" : "in_person";
    form.reset({
      title: evt.title,
      description: evt.description ?? "",
      start_time: localStart,
      end_time: localEnd,
      location: evt.location ?? "",
      registration_link: evt.registration_link ?? "",
      is_public: evt.is_public,
      event_type: inferredType,
    });
    setSheetOpen(true);
  };

  const closeSheet = (autoSaveDraft: boolean) => {
    if (autoSaveDraft && !editingEvent) {
      void (async () => {
        const values = form.getValues();
        if (!values.title.trim() && !values.start_time) {
          setSheetOpen(false);
          setEditingEvent(null);
          return;
        }
        const draftPayload = {
          title: values.title || "Untitled event",
          description: values.description || null,
          start_time: fromLocalInputValue(values.start_time),
          end_time: fromLocalInputValue(values.end_time || "") || null,
          location: values.location || null,
          is_public: false,
          registration_link: values.registration_link ? values.registration_link : null,
        };
        const { error } = await supabase.from("events").insert(draftPayload);
        if (error) {
          toast({
            title: "Error saving draft",
            description: getAdminErrorMessage(error),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Draft saved",
            description: "Event saved as a draft.",
          });
          await loadEvents();
        }
      })();
    }
    setSheetOpen(false);
    setEditingEvent(null);
  };

  const onSubmitForm = async (values: EventFormValues) => {
    setSavingId(editingEvent ? editingEvent.id : "create");

    const isVirtual = values.event_type === "virtual";
    const payload = {
      title: values.title,
      description: values.description || null,
      start_time: fromLocalInputValue(values.start_time),
      end_time: fromLocalInputValue(values.end_time || "") || null,
      location: values.location || (isVirtual ? "Online" : null),
      is_public: values.is_public,
      registration_link: values.registration_link ? values.registration_link : null,
    };

    const { error } = editingEvent
      ? await supabase.from("events").update(payload).eq("id", editingEvent.id)
      : await supabase.from("events").insert(payload);

    if (error) {
      toast({
        title: editingEvent ? "Error saving event" : "Error creating event",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: editingEvent ? "The event has been updated." : "The event has been added.",
      });
      closeSheet(false);
      await loadEvents();
    }

    setSavingId(null);
  };

  const handleQuickTogglePublic = async (evt: AdminEvent) => {
    const next = !evt.is_public;
    setSavingId(evt.id);
    const { error } = await supabase
      .from("events")
      .update({
        is_public: next,
      })
      .eq("id", evt.id);

    if (error) {
      toast({
        title: "Error updating visibility",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: next ? "Published" : "Unpublished",
        description: next
          ? "Event is now visible on the public events page."
          : "Event is now hidden from the public events page.",
      });
      await loadEvents();
    }

    setSavingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting event",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Event removed.",
      });
      await loadEvents();
    }
    setDeletingId(null);
    setDeleteTargetId(null);
  };

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((evt) => {
        const date = new Date(evt.start_time);
        if (timeFilter === "upcoming" && date < now) return false;
        if (timeFilter === "past" && date >= now) return false;
        return true;
      })
      .filter((evt) => {
        if (statusFilter === "published") return evt.is_public;
        if (statusFilter === "draft") return !evt.is_public;
        return true;
      })
      .filter((evt) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          evt.title.toLowerCase().includes(q) ||
          (evt.description ?? "").toLowerCase().includes(q) ||
          (evt.location ?? "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aTime = new Date(a.start_time).getTime();
        const bTime = new Date(b.start_time).getTime();
        return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
      });
  }, [events, timeFilter, statusFilter, search, sortDirection]);

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
            <h1 className="text-2xl font-bold">Events</h1>
            <p className="text-muted-foreground text-sm">
              Manage PMA events stored in Supabase.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle>All Events</CardTitle>
              <p className="text-xs text-muted-foreground">
                Search, filter, and manage upcoming and past events. Times are shown in your local
                timezone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search title, description, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button size="sm" onClick={openCreateSheet}>
                <Plus className="h-4 w-4 mr-1" />
                New Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-full border bg-card p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setTimeFilter("upcoming")}
                    className={`px-3 py-1 rounded-full ${
                      timeFilter === "upcoming"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter("past")}
                    className={`px-3 py-1 rounded-full ${
                      timeFilter === "past"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Past
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter("all")}
                    className={`px-3 py-1 rounded-full ${
                      timeFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    All
                  </button>
                </div>
                <div className="inline-flex rounded-full border bg-card p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1 rounded-full ${
                      statusFilter === "all"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    All statuses
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("published")}
                    className={`px-3 py-1 rounded-full ${
                      statusFilter === "published"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("draft")}
                    className={`px-3 py-1 rounded-full ${
                      statusFilter === "draft"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))
                }
              >
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="text-sm text-destructive text-center">{loadError}</p>
              <Button variant="outline" size="sm" onClick={() => void loadEvents()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              {filteredEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No events match your current search and filter.
                </p>
              ) : (
                <Table className="table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="w-[260px] whitespace-nowrap">When</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[220px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredEvents.map((evt) => {
                        const start = new Date(evt.start_time);
                        const end = evt.end_time ? new Date(evt.end_time) : null;
                        const formatDate = (d: Date) =>
                          d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                        const formatTime = (d: Date) =>
                          d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
                        const isSameDay =
                          !!end &&
                          start.getFullYear() === end.getFullYear() &&
                          start.getMonth() === end.getMonth() &&
                          start.getDate() === end.getDate();
                        return (
                          <TableRow key={evt.id}>
                            <TableCell className="align-top min-w-0">
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-medium break-words">{evt.title}</span>
                                {evt.description && (
                                  <span className="text-xs text-muted-foreground line-clamp-2">
                                    {evt.description}
                                  </span>
                                )}
                                <div className="text-xs text-muted-foreground min-w-0 truncate">
                                  {evt.location || "TBA"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm whitespace-nowrap align-top">
                              {!end ? (
                                <span>
                                  {formatDate(start)}, {formatTime(start)}
                                </span>
                              ) : isSameDay ? (
                                <span>
                                  {formatDate(start)}, {formatTime(start)} – {formatTime(end)}
                                </span>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <span>
                                    {formatDate(start)}, {formatTime(start)}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {formatDate(end)}, {formatTime(end)}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={evt.is_public ? "default" : "outline"}
                                className={evt.is_public ? "" : "border-dashed"}
                              >
                                {evt.is_public ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                {evt.registration_link ? (
                                  <Button
                                    asChild
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                  >
                                    <a
                                      href={evt.registration_link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    disabled
                                    aria-label="No registration link"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => openEditSheet(evt)}
                                  disabled={savingId === evt.id || deletingId === evt.id}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant={evt.is_public ? "outline" : "default"}
                                  onClick={() => handleQuickTogglePublic(evt)}
                                  disabled={savingId === evt.id || deletingId === evt.id}
                                >
                                  {evt.is_public ? "Unpublish" : "Publish"}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => setDeleteTargetId(evt.id)}
                                  disabled={savingId === evt.id || deletingId === evt.id}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </>
          )}
          </CardContent>
        </Card>

        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            if (open) {
              setSheetOpen(true);
            } else {
              closeSheet(true);
            }
          }}
        >
          <SheetContent side="right" className="w-full sm:max-w-xl space-y-4 min-w-0">
            <SheetHeader>
              <SheetTitle>{editingEvent ? "Edit Event" : "New Event"}</SheetTitle>
            </SheetHeader>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className="space-y-3 mt-2 min-w-0 overflow-x-hidden"
              noValidate
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Event title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Short description shown on the events page"
                  rows={4}
                  {...form.register("description")}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start date & time</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                    <div className="relative min-w-0">
                      <Input
                        ref={(el) => {
                          startDateRef.current = el;
                        }}
                        type="date"
                        className="pr-10 has-picker-icon w-full min-w-0"
                        value={startDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setStartDate(value);
                          if (value && startTimeOnly) {
                            const combined = `${value}T${startTimeOnly}`;
                            form.setValue("start_time", combined, { shouldDirty: true });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-foreground/90 hover:text-foreground shrink-0"
                        onClick={() => {
                          const el = startDateRef.current;
                          (el as any)?.showPicker?.();
                          el?.focus();
                        }}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative min-w-0">
                      <Input
                        ref={(el) => {
                          startTimeRef.current = el;
                        }}
                        type="time"
                        className="pr-10 has-picker-icon w-full min-w-0"
                        value={startTimeOnly}
                        onChange={(e) => {
                          const value = e.target.value;
                          setStartTimeOnly(value);
                          if (startDate && value) {
                            const combined = `${startDate}T${value}`;
                            form.setValue("start_time", combined, { shouldDirty: true });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-foreground/90 hover:text-foreground shrink-0"
                        onClick={() => {
                          const el = startTimeRef.current;
                          (el as any)?.showPicker?.();
                          el?.focus();
                        }}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {form.formState.errors.start_time && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.start_time.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End date & time (optional)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                    <div className="relative min-w-0">
                      <Input
                        ref={(el) => {
                          endDateRef.current = el;
                        }}
                        type="date"
                        className="pr-10 has-picker-icon w-full min-w-0"
                        value={endDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEndDate(value);
                          if (value && endTimeOnly) {
                            const combined = `${value}T${endTimeOnly}`;
                            form.setValue("end_time", combined, { shouldDirty: true });
                          } else if (!value && !endTimeOnly) {
                            form.setValue("end_time", "", { shouldDirty: true });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-foreground/90 hover:text-foreground shrink-0"
                        onClick={() => {
                          const el = endDateRef.current;
                          (el as any)?.showPicker?.();
                          el?.focus();
                        }}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative min-w-0">
                      <Input
                        ref={(el) => {
                          endTimeRef.current = el;
                        }}
                        type="time"
                        className="pr-10 has-picker-icon w-full min-w-0"
                        value={endTimeOnly}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEndTimeOnly(value);
                          if (endDate && value) {
                            const combined = `${endDate}T${value}`;
                            form.setValue("end_time", combined, { shouldDirty: true });
                          } else if (!endDate && !value) {
                            form.setValue("end_time", "", { shouldDirty: true });
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-foreground/90 hover:text-foreground shrink-0"
                        onClick={() => {
                          const el = endTimeRef.current;
                          (el as any)?.showPicker?.();
                          el?.focus();
                        }}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {form.formState.errors.end_time && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.end_time.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Event type</label>
                  <RadioGroup
                    value={form.watch("event_type")}
                    onValueChange={(val) =>
                      form.setValue("event_type", val as EventFormValues["event_type"], {
                        shouldDirty: true,
                      })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="in_person" id="type-in-person" />
                      <label htmlFor="type-in-person" className="text-sm">
                        In person
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="virtual" id="type-virtual" />
                      <label htmlFor="type-virtual" className="text-sm">
                        Virtual
                      </label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {form.watch("event_type") === "virtual"
                      ? "Virtual location label (optional)"
                      : "Location"}
                  </label>
                  <Input
                    placeholder={
                      form.watch("event_type") === "virtual"
                        ? "Online (Zoom, Google Meet, etc.)"
                        : "TNRB 260"
                    }
                    {...form.register("location")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {form.watch("event_type") === "virtual"
                      ? "Virtual meeting link (Zoom/Meet)"
                      : "Registration link (optional)"}
                  </label>
                  <Input
                    placeholder="https://..."
                    {...form.register("registration_link")}
                  />
                  {form.formState.errors.registration_link && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.registration_link.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="sheet-is-public"
                  checked={form.watch("is_public")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_public", Boolean(checked), {
                      shouldDirty: true,
                    })
                  }
                />
                <label htmlFor="sheet-is-public" className="text-sm">
                  Public event (visible on events page)
                </label>
              </div>
              <SheetFooter className="pt-2">
                <div className="flex w-full justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeSheet(true)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting
                      ? "Saving..."
                      : editingEvent
                      ? "Save changes"
                      : "Create event"}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        <AlertDialog
          open={deleteTargetId !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTargetId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this event?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the event. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deletingId === deleteTargetId}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
                disabled={deletingId === deleteTargetId}
              >
                {deletingId === deleteTargetId ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminEventsPage;


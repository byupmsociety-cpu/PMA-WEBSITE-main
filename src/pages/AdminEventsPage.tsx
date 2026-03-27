import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { 
  AdminEvent, TimeFilter, StatusFilter, SortDirection, EventSuggestion,
  eventFormSchema, EventFormValues, toLocalInputValue, fromLocalInputValue
} from "@/components/admin/events/adminEventsTypes";
import { AdminEventsTable } from "@/components/admin/events/AdminEventsTable";
import { AdminEventSuggestions } from "@/components/admin/events/AdminEventSuggestions";
import { AdminEventFormSheet } from "@/components/admin/events/AdminEventFormSheet";

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
  const [eventImageUrl, setEventImageUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [suggestionActionId, setSuggestionActionId] = useState<string | null>(null);

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
        void loadSuggestions();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadEvents = async () => {
    setLoadingData(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, start_time, end_time, location, is_public, registration_link, image_url")
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
          image_url: e.image_url ?? null,
        }))
      );
    }
    setLoadingData(false);
  };

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    const { data, error } = await supabase
      .from("event_suggestions")
      .select("id, title, description, submitter_email, created_at, read_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading event suggestions", error);
      toast({
        title: "Error loading suggestions",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      setSuggestions(
        (data ?? []).map((s: any) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          submitter_email: s.submitter_email,
          created_at: s.created_at,
          read_at: s.read_at,
        }))
      );
    }
    setLoadingSuggestions(false);
  };

  const handleCreateEventFromSuggestion = (suggestion: EventSuggestion) => {
    setEditingEvent(null);
    setEventImageUrl(null);
    form.reset({
      title: suggestion.title,
      description: suggestion.description ?? "",
      start_time: "",
      end_time: "",
      location: "",
      registration_link: "",
      is_public: false,
      event_type: "in_person",
    });
    setStartDate("");
    setStartTimeOnly("");
    setEndDate("");
    setEndTimeOnly("");
    setSheetOpen(true);
  };

  const handleMarkSuggestionRead = async (id: string) => {
    setSuggestionActionId(id);
    const { error } = await supabase
      .from("event_suggestions")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    setSuggestionActionId(null);
    if (error) {
      toast({ title: "Error", description: getAdminErrorMessage(error), variant: "destructive" });
    } else {
      await loadSuggestions();
    }
  };

  const handleDeleteSuggestion = async (id: string) => {
    setSuggestionActionId(id);
    const { error } = await supabase.from("event_suggestions").delete().eq("id", id);
    setSuggestionActionId(null);
    if (error) {
      toast({ title: "Error", description: getAdminErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Suggestion removed" });
      await loadSuggestions();
    }
  };

  const openCreateSheet = () => {
    setEditingEvent(null);
    setEventImageUrl(null);
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
    setEventImageUrl(evt.image_url ?? null);
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
          image_url: eventImageUrl || null,
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
    setEventImageUrl(null);
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
      image_url: eventImageUrl || null,
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

        <AdminEventsTable
          filteredEvents={filteredEvents}
          loadingData={loadingData}
          loadError={loadError}
          loadEvents={loadEvents}
          search={search}
          setSearch={setSearch}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          openCreateSheet={openCreateSheet}
          openEditSheet={openEditSheet}
          handleQuickTogglePublic={handleQuickTogglePublic}
          setDeleteTargetId={setDeleteTargetId}
          savingId={savingId}
          deletingId={deletingId}
        />

        <AdminEventSuggestions
          suggestions={suggestions}
          loadingSuggestions={loadingSuggestions}
          loadSuggestions={loadSuggestions}
          suggestionActionId={suggestionActionId}
          handleCreateEventFromSuggestion={handleCreateEventFromSuggestion}
          handleMarkSuggestionRead={handleMarkSuggestionRead}
          handleDeleteSuggestion={handleDeleteSuggestion}
        />

        <AdminEventFormSheet
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
          closeSheet={closeSheet}
          onSubmitForm={onSubmitForm}
          editingEvent={editingEvent}
          form={form}
          eventImageUrl={eventImageUrl}
          setEventImageUrl={setEventImageUrl}
          startDate={startDate}
          setStartDate={setStartDate}
          startTimeOnly={startTimeOnly}
          setStartTimeOnly={setStartTimeOnly}
          endDate={endDate}
          setEndDate={setEndDate}
          endTimeOnly={endTimeOnly}
          setEndTimeOnly={setEndTimeOnly}
          startDateRef={startDateRef}
          startTimeRef={startTimeRef}
          endDateRef={endDateRef}
          endTimeRef={endTimeRef}
        />

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
              <AlertDialogCancel disabled={deletingId === deleteTargetId}>
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

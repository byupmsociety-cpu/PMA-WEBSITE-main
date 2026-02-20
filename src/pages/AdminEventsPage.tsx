import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

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

const AdminEventsPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    is_public: true,
    registration_link: "",
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
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, start_time, end_time, location, is_public, registration_link")
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Error loading events", error);
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

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
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const { error } = await supabase.from("events").insert({
      title: newEvent.title,
      description: newEvent.description || null,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time || null,
      location: newEvent.location || null,
      is_public: newEvent.is_public,
      registration_link: newEvent.registration_link || null,
    });

    if (error) {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Event created",
        description: "The event has been added.",
      });
      setNewEvent({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        location: "",
        is_public: true,
        registration_link: "",
      });
      await loadEvents();
    }

    setCreating(false);
  };

  const handleUpdate = async (evt: AdminEvent) => {
    setSavingId(evt.id);
    const { error } = await supabase
      .from("events")
      .update({
        title: evt.title,
        description: evt.description,
        start_time: evt.start_time,
        end_time: evt.end_time,
        location: evt.location,
        is_public: evt.is_public,
        registration_link: evt.registration_link,
      })
      .eq("id", evt.id);

    if (error) {
      toast({
        title: "Error saving event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Event updated.",
      });
      await loadEvents();
    }

    setSavingId(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Event removed.",
      });
      await loadEvents();
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
          <CardHeader>
            <CardTitle>Add Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-3">
              <Input
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <Input
                type="datetime-local"
                placeholder="Start time"
                value={newEvent.start_time}
                onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                required
              />
              <Input
                type="datetime-local"
                placeholder="End time"
                value={newEvent.end_time}
                onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
              <Input
                placeholder="Registration link"
                value={newEvent.registration_link}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, registration_link: e.target.value })
                }
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_public"
                  checked={newEvent.is_public}
                  onCheckedChange={(checked) =>
                    setNewEvent({ ...newEvent, is_public: Boolean(checked) })
                  }
                />
                <label htmlFor="is_public" className="text-sm">
                  Public event
                </label>
              </div>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {events.map((evt) => (
            <Card key={evt.id}>
              <CardContent className="pt-4 space-y-3">
                <Input
                  className="font-semibold"
                  value={evt.title}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id ? { ...row, title: e.target.value } : row
                      )
                    )
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={evt.description ?? ""}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id ? { ...row, description: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  type="datetime-local"
                  value={evt.start_time ? evt.start_time.slice(0, 16) : ""}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id ? { ...row, start_time: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  type="datetime-local"
                  value={evt.end_time ? evt.end_time.slice(0, 16) : ""}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id ? { ...row, end_time: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  placeholder="Location"
                  value={evt.location ?? ""}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id ? { ...row, location: e.target.value } : row
                      )
                    )
                  }
                />
                <Input
                  placeholder="Registration link"
                  value={evt.registration_link ?? ""}
                  onChange={(e) =>
                    setEvents((prev) =>
                      prev.map((row) =>
                        row.id === evt.id
                          ? { ...row, registration_link: e.target.value }
                          : row
                      )
                    )
                  }
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`event-public-${evt.id}`}
                    checked={evt.is_public}
                    onCheckedChange={(checked) =>
                      setEvents((prev) =>
                        prev.map((row) =>
                          row.id === evt.id
                            ? { ...row, is_public: Boolean(checked) }
                            : row
                        )
                      )
                    }
                  />
                  <label
                    htmlFor={`event-public-${evt.id}`}
                    className="text-sm select-none"
                  >
                    Public event
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(evt)}
                    disabled={savingId === evt.id}
                  >
                    {savingId === evt.id ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(evt.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No events yet. Add your first event above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;


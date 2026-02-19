import { useState, useEffect, useCallback } from "react";

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  status?: string;
}

interface AirtableRecord {
  id: string;
  fields: {
    title?: string;
    date?: string;
    description?: string;
    location?: string;
    status?: string;
  };
}

export function useEvents() {
  const [data, setData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/airtable/events", {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const records: AirtableRecord[] = json.records ?? [];

      const events: Event[] = records.map((record) => ({
        id: record.id,
        title: record.fields.title ?? "",
        date: record.fields.date ?? "",
        description: record.fields.description ?? "",
        location: record.fields.location ?? "",
        status: record.fields.status ?? "upcoming",
      }));

      setData(events);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events. Please try again later.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
    refetch: fetchEvents,
  };
}

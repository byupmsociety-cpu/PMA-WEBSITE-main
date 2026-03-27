import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit2, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminEvent, TimeFilter, StatusFilter, SortDirection } from "./adminEventsTypes";

interface AdminEventsTableProps {
  filteredEvents: AdminEvent[];
  loadingData: boolean;
  loadError: string | null;
  loadEvents: () => void;
  search: string;
  setSearch: (v: string) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (v: TimeFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  sortDirection: SortDirection;
  setSortDirection: (v: (prev: SortDirection) => SortDirection) => void;
  openCreateSheet: () => void;
  openEditSheet: (evt: AdminEvent) => void;
  handleQuickTogglePublic: (evt: AdminEvent) => void;
  setDeleteTargetId: (id: string) => void;
  savingId: string | null;
  deletingId: string | null;
}

export const AdminEventsTable: React.FC<AdminEventsTableProps> = ({
  filteredEvents,
  loadingData,
  loadError,
  loadEvents,
  search,
  setSearch,
  timeFilter,
  setTimeFilter,
  statusFilter,
  setStatusFilter,
  sortDirection,
  setSortDirection,
  openCreateSheet,
  openEditSheet,
  handleQuickTogglePublic,
  setDeleteTargetId,
  savingId,
  deletingId,
}) => {
  return (
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
            <Button variant="outline" size="sm" onClick={() => loadEvents()}>
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
  );
};

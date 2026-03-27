import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lightbulb, Trash2 } from "lucide-react";
import { EventSuggestion } from "./adminEventsTypes";

interface AdminEventSuggestionsProps {
  suggestions: EventSuggestion[];
  loadingSuggestions: boolean;
  loadSuggestions: () => void;
  suggestionActionId: string | null;
  handleCreateEventFromSuggestion: (s: EventSuggestion) => void;
  handleMarkSuggestionRead: (id: string) => void;
  handleDeleteSuggestion: (id: string) => void;
}

export const AdminEventSuggestions: React.FC<AdminEventSuggestionsProps> = ({
  suggestions,
  loadingSuggestions,
  loadSuggestions,
  suggestionActionId,
  handleCreateEventFromSuggestion,
  handleMarkSuggestionRead,
  handleDeleteSuggestion,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Event suggestions
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Ideas submitted from the public events page. Create an event from a suggestion or mark as read.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => loadSuggestions()} disabled={loadingSuggestions}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loadingSuggestions ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No event suggestions yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="max-w-[200px]">Description</TableHead>
                <TableHead className="w-[140px]">Submitted</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((s) => (
                <TableRow key={s.id} className={s.read_at ? "opacity-75" : ""}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={s.description ?? undefined}>
                    {s.description || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {s.submitter_email && <span className="block truncate" title={s.submitter_email}>{s.submitter_email}</span>}
                    <span>{new Date(s.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateEventFromSuggestion(s)}
                        disabled={!!suggestionActionId}
                      >
                        Create event
                      </Button>
                      {!s.read_at && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkSuggestionRead(s.id)}
                          disabled={!!suggestionActionId}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteSuggestion(s.id)}
                        disabled={!!suggestionActionId}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

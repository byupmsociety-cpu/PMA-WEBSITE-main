import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ImageUploadWithCrop } from "@/components/ImageUploadWithCrop";
import { AdminEvent, EventFormValues } from "./adminEventsTypes";

interface AdminEventFormSheetProps {
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
  closeSheet: (autoSaveDraft: boolean) => void;
  onSubmitForm: (values: EventFormValues) => void;
  editingEvent: AdminEvent | null;
  form: UseFormReturn<EventFormValues>;
  eventImageUrl: string | null;
  setEventImageUrl: (v: string | null) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  startTimeOnly: string;
  setStartTimeOnly: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  endTimeOnly: string;
  setEndTimeOnly: (v: string) => void;
  startDateRef: React.MutableRefObject<HTMLInputElement | null>;
  startTimeRef: React.MutableRefObject<HTMLInputElement | null>;
  endDateRef: React.MutableRefObject<HTMLInputElement | null>;
  endTimeRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const AdminEventFormSheet: React.FC<AdminEventFormSheetProps> = ({
  sheetOpen,
  setSheetOpen,
  closeSheet,
  onSubmitForm,
  editingEvent,
  form,
  eventImageUrl,
  setEventImageUrl,
  startDate,
  setStartDate,
  startTimeOnly,
  setStartTimeOnly,
  endDate,
  setEndDate,
  endTimeOnly,
  setEndTimeOnly,
  startDateRef,
  startTimeRef,
  endDateRef,
  endTimeRef,
}) => {
  return (
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
      <SheetContent side="right" className="flex h-full max-h-full w-full flex-col sm:max-w-xl min-w-0 p-0 gap-0">
        <SheetHeader className="shrink-0 px-6 pt-12 pb-2">
          <SheetTitle>{editingEvent ? "Edit Event" : "New Event"}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-3 mt-2 min-w-0 overflow-x-hidden"
            noValidate
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Event title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Short description shown on the events page" rows={4} {...form.register("description")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Flyer / image</label>
              <ImageUploadWithCrop
                bucket="event-images"
                filePrefix="event"
                value={eventImageUrl}
                onChange={setEventImageUrl}
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
                  <p className="text-xs text-destructive">{form.formState.errors.start_time.message}</p>
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
                  <p className="text-xs text-destructive">{form.formState.errors.end_time.message}</p>
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
                    <label htmlFor="type-in-person" className="text-sm">In person</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="virtual" id="type-virtual" />
                    <label htmlFor="type-virtual" className="text-sm">Virtual</label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {form.watch("event_type") === "virtual" ? "Virtual location label (optional)" : "Location"}
                </label>
                <Input placeholder={form.watch("event_type") === "virtual" ? "Online (Zoom, Google Meet, etc.)" : "TNRB 260"} {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {form.watch("event_type") === "virtual" ? "Virtual meeting link (Zoom/Meet)" : "Registration link (optional)"}
                </label>
                <Input placeholder="https://..." {...form.register("registration_link")} />
                {form.formState.errors.registration_link && (
                  <p className="text-xs text-destructive">{form.formState.errors.registration_link.message}</p>
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
              <label htmlFor="sheet-is-public" className="text-sm">Public event (visible on events page)</label>
            </div>
            <SheetFooter className="pt-2">
              <div className="flex w-full justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => closeSheet(true)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : editingEvent ? "Save changes" : "Create event"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

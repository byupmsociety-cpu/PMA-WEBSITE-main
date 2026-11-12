import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePrep } from "@/hooks/usePrepState";
import { SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import { STEP_BY_ID, routeFor } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { Eyebrow, focusRing } from "../shared";
import EmailComposer from "./EmailComposer";

const useIsDesktop = () => {
  const query = "(min-width: 1024px)";
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return desktop;
};

const KINDS = Object.keys(SESSION_KINDS) as SessionKind[];

const AskOfficerSheet = () => {
  const { sheetOpen, setSheetOpen, composer, setComposer } = usePrep();
  const desktop = useIsDesktop();
  const step = composer.stepId ? STEP_BY_ID[composer.stepId] : null;
  const session = SESSION_KINDS[composer.kind];
  const title = step?.touchpoint && step.touchpoint.where === "presidency" ? step.touchpoint.label : `Ask for a ${session.label.toLowerCase()}`;

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side={desktop ? "right" : "bottom"}
        className={cn(
          "overflow-y-auto p-0",
          desktop ? "w-full sm:max-w-[500px]" : "max-h-[90vh] rounded-t-2xl",
        )}
      >
        <SheetHeader className="sticky top-0 z-10 border-b border-border bg-background px-5 py-4 pr-12 text-left">
          <Eyebrow>{step ? `From your plan: ${step.title}` : "Talk to a person"}</Eyebrow>
          <SheetTitle className="text-[22px] font-bold leading-tight">{title}</SheetTitle>
          <SheetDescription className="sr-only">Write a short email to a PMA officer.</SheetDescription>
        </SheetHeader>
        <div className="px-5 py-5">
          <div className="mb-4 flex rounded-lg border border-border p-1 text-sm" role="group" aria-label="Kind of session">
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={composer.kind === k}
                onClick={() => setComposer((c) => ({ ...c, kind: k, to: routeFor(c.stepId, k)[0] }))}
                className={cn(
                  "min-h-9 flex-1 rounded-md px-2 py-1.5",
                  composer.kind === k ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  focusRing,
                )}
              >
                {SESSION_KINDS[k].label}
              </button>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <Eyebrow>Bring</Eyebrow>
              <div className="mt-1">{session.bring.join(". ")}.</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <Eyebrow>You leave with</Eyebrow>
              <div className="mt-1">{session.leave.join(". ")}.</div>
            </div>
          </div>
          <EmailComposer compact onSent={() => setSheetOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AskOfficerSheet;

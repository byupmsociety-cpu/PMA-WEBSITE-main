import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, Copy, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePrep } from "@/hooks/usePrepState";
import { PRESIDENCY } from "@/lib/officers";
import { OFFICER_NOTES, ROUND_STEP, SESSION_KINDS } from "@/lib/prepJourney";
import { draftEmail, mailtoHref } from "@/lib/prepEmail";
import { ROUND_OPTIONS, STEP_BY_ID, routeFor, stepChecks, type PlanRound } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { firstName } from "../copy";
import { Eyebrow, cardClass } from "../shared";

const selectClass =
  "mt-1 flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const EmailComposer = ({ compact, onSent }: { compact?: boolean; onSent?: () => void }) => {
  const { composer: c, setComposer, isMember, checks, recordAsk } = usePrep();
  const session = SESSION_KINDS[c.kind];
  const officer = PRESIDENCY.find((o) => o.name === c.to) ?? PRESIDENCY[0];
  const route = routeFor(c.stepId, c.kind);
  const names = [...new Set([...route, ...PRESIDENCY.map((o) => o.name)])];
  const locked = !isMember && !session.openToNonMembers;
  const roundLabel = ROUND_OPTIONS.find((r) => r.value === c.round)?.label ?? "Product sense";
  const prepStep = c.kind === "mock-interview" && c.stepId !== "offer-pay-forward" ? ROUND_STEP[c.round] : c.stepId;
  const prepRow = prepStep ? stepChecks(checks, prepStep) : [];

  const draft = useMemo(
    () =>
      draftEmail({
        kind: c.kind,
        to: c.to,
        stepId: c.stepId,
        stepTitle: c.stepId ? STEP_BY_ID[c.stepId]?.title ?? null : null,
        roundLabel,
        company: c.company,
        focus: c.focus,
        isMember,
      }),
    [c.kind, c.to, c.stepId, roundLabel, c.company, c.focus, isMember],
  );
  const [body, setBody] = useState(draft.body);
  useEffect(() => setBody(draft.body), [draft.body]);

  const href = mailtoHref(officer.email ?? "", draft.subject, body);
  const update = (patch: Partial<typeof c>) => setComposer((prev) => ({ ...prev, ...patch }));
  const idPrefix = compact ? "sheet" : "people";

  const form = (
    <div className="grid gap-4">
      {prepStep && STEP_BY_ID[prepStep] && (
        <div className="rounded-lg bg-muted p-3">
          <Eyebrow>Before you ask, from {STEP_BY_ID[prepStep].title}</Eyebrow>
          <ul className="mt-1.5 space-y-1 text-sm">
            {STEP_BY_ID[prepStep].checklist.map((x, i) => (
              <li key={x} className="flex gap-2">
                <Check
                  className={cn("mt-0.5 h-4 w-4 shrink-0", prepRow[i] ? "text-primary" : "text-border")}
                  aria-label={prepRow[i] ? "Done" : "Not done"}
                />
                <span className={cn(!prepRow[i] && "text-muted-foreground")}>{x}</span>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 text-[13px] text-muted-foreground">
            {prepRow.filter(Boolean).length} of {prepRow.length} done. You will get more out of the session with these done.
          </div>
        </div>
      )}
      <div>
        <Label htmlFor={`${idPrefix}-to`} className="text-sm font-semibold">
          Send to
        </Label>
        <select id={`${idPrefix}-to`} value={c.to} onChange={(e) => update({ to: e.target.value })} className={selectClass}>
          {names.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-[13px] text-muted-foreground">
          {officer.position}
          {route.includes(c.to) ? " · usually handles this" : ""}
          {OFFICER_NOTES[c.to] ? `. ${OFFICER_NOTES[c.to]}` : ""}
        </span>
      </div>
      {c.kind === "mock-interview" && (
        <div>
          <Label htmlFor={`${idPrefix}-round`} className="text-sm font-semibold">
            Round
          </Label>
          <select
            id={`${idPrefix}-round`}
            value={c.round}
            onChange={(e) => update({ round: e.target.value as PlanRound })}
            className={selectClass}
          >
            {ROUND_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {c.kind !== "coffee-chat" && (
        <div>
          <Label htmlFor={`${idPrefix}-company`} className="text-sm font-semibold">
            {c.kind === "mock-interview" ? "Company and date" : "Where you are applying"}
          </Label>
          <Input
            id={`${idPrefix}-company`}
            value={c.company}
            onChange={(e) => update({ company: e.target.value })}
            className="mt-1 bg-card text-base"
          />
        </div>
      )}
      <div>
        <Label htmlFor={`${idPrefix}-focus`} className="text-sm font-semibold">
          {c.kind === "mock-interview"
            ? "What you want feedback on"
            : c.kind === "resume-review"
              ? "Your one question"
              : "Anything on your mind (optional)"}
        </Label>
        <Input
          id={`${idPrefix}-focus`}
          value={c.focus}
          onChange={(e) => update({ focus: e.target.value })}
          className="mt-1 bg-card text-base"
        />
      </div>
    </div>
  );

  const preview = (
    <>
      <div className={cn(cardClass, "rounded-lg text-[15px]")}>
        <div className="flex gap-2 border-b border-border px-4 py-2.5">
          <span className="w-16 shrink-0 text-muted-foreground">To</span>
          <span className="break-all font-medium">
            {c.to} &lt;{officer.email}&gt;
          </span>
        </div>
        <div className="flex gap-2 border-b border-border px-4 py-2.5">
          <span className="w-16 shrink-0 text-muted-foreground">Subject</span>
          <span className="font-medium">{draft.subject}</span>
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={compact ? 9 : 11}
          aria-label="Email body"
          className="resize-y rounded-none rounded-b-lg border-0 px-4 py-3 text-[15px] leading-relaxed focus-visible:ring-inset"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {locked ? (
          <span className="inline-flex items-center gap-1.5 text-[15px] text-muted-foreground">
            <Lock className="h-4 w-4" aria-hidden="true" /> {session.label}s are for members. Coffee chats are open to anyone.
          </span>
        ) : (
          <>
            <Button asChild>
              <a
                href={href}
                onClick={() => {
                  recordAsk(c.stepId ?? c.kind, c.to);
                  onSent?.();
                }}
              >
                <Mail className="h-4 w-4" aria-hidden="true" /> Open in email
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard?.writeText(body).then(
                  () => toast("Copied. Paste it into an email."),
                  () => toast("Could not copy. Select the text and copy it."),
                );
              }}
            >
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy text
            </Button>
            {officer.bookingUrl ? (
              <Button asChild variant="outline">
                <a href={officer.bookingUrl} target="_blank" rel="noopener noreferrer">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Book a time
                </a>
              </Button>
            ) : (
              <span title={`Lights up when ${firstName(c.to)} adds a booking link`}>
                <Button variant="outline" disabled>
                  <CalendarDays className="h-4 w-4" aria-hidden="true" /> Book a time (coming soon)
                </Button>
              </span>
            )}
          </>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        No reply in 3 school days? Send it to the next name on the list. That is not rude, it is how we want it to work. Officers
        are students with exams too.
      </p>
    </>
  );

  if (compact) {
    return (
      <>
        {form}
        <Eyebrow className="mb-2 mt-5">Your email, ready to send. Edit anything.</Eyebrow>
        {preview}
      </>
    );
  }

  return (
    <section className={cn(cardClass, "mt-6 grid lg:grid-cols-[1fr_1.15fr]")}>
      <div className="border-b border-border p-5 md:p-6 lg:border-b-0 lg:border-r">
        <Eyebrow>Write the email</Eyebrow>
        <h2 className="mt-1 text-[21px] font-bold">{session.label} request</h2>
        <div className="mt-4">{form}</div>
        <div className="mt-5 rounded-lg bg-muted p-3 text-sm leading-snug">
          <b>Honest note:</b> booking links are not set up yet, so email is the way in for now. If an officer adds a booking link,
          the Book a time button works for them.
        </div>
      </div>
      <div className="rounded-b-xl bg-background p-5 md:p-6 lg:rounded-r-xl lg:rounded-bl-none">
        <Eyebrow className="mb-3">Preview. Edit anything.</Eyebrow>
        {preview}
      </div>
    </section>
  );
};

export default EmailComposer;

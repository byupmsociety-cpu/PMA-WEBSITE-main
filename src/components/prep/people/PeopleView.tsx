import { Coffee, FileText, Lock, Mic, type LucideIcon } from "lucide-react";
import PresidencyConnect from "@/components/PresidencyConnect";
import { usePrep } from "@/hooks/usePrepState";
import { PEER_OPTIONS, SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import { routeFor } from "@/lib/prepPlan";
import { findResource } from "@/lib/resourceCatalog";
import { cn } from "@/lib/utils";
import { firstName } from "../copy";
import { Eyebrow, OfficerAvatar, cardClass, focusRing } from "../shared";
import EmailComposer from "./EmailComposer";

const ICONS: Record<SessionKind, LucideIcon> = { "coffee-chat": Coffee, "resume-review": FileText, "mock-interview": Mic };
const KINDS = Object.keys(SESSION_KINDS) as SessionKind[];

const PeopleView = () => {
  const { composer, setComposer, isMember, openResource } = usePrep();

  const pick = (kind: SessionKind) =>
    setComposer((c) => {
      const stepId = kind === "mock-interview" ? c.stepId : null;
      return { ...c, kind, stepId, to: routeFor(stepId, kind)[0] };
    });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="max-w-3xl">
        <Eyebrow>The human layer</Eyebrow>
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight md:text-[34px]">Talk to someone who has done this</h1>
        <p className="mt-2 text-[17px] text-foreground/80">
          Most of us found the good stuff because a person pointed us to it. Officers have been through PM recruiting. Your plan
          suggests one at the moments where a person beats a video.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {KINDS.map((k) => {
          const s = SESSION_KINDS[k];
          const on = composer.kind === k;
          const locked = !isMember && !s.openToNonMembers;
          const Icon = ICONS[k];
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => pick(k)}
              className={cn(
                "flex flex-col rounded-xl border-2 bg-card p-5 text-left text-card-foreground",
                on ? "border-primary" : "border-border hover:border-accent",
                focusRing,
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-10 w-10 place-content-center rounded-lg",
                    on ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                  {locked && (
                    <>
                      <Lock className="h-3 w-3" aria-hidden="true" /> Members ·
                    </>
                  )}{" "}
                  {s.length}
                </span>
              </div>
              <div className="mt-3 font-heading text-[19px] font-bold">{s.label}</div>
              <div className="mt-2 text-sm">
                <span className="font-semibold">When it helps:</span> <span className="text-foreground/80">{s.when}</span>
              </div>
              <div className="mt-1.5 text-sm">
                <span className="font-semibold">Bring:</span> <span className="text-foreground/80">{s.bring.join(". ")}.</span>
              </div>
              <div className="mt-1.5 flex-1 text-sm">
                <span className="font-semibold">You leave with:</span>{" "}
                <span className="text-foreground/80">{s.leave.join(". ")}.</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {s.officers.map((n) => (
                  <OfficerAvatar key={n} name={n} className="h-8 w-8" />
                ))}
                <span className="text-[13px] text-muted-foreground">{s.officers.map(firstName).join(", ")}</span>
              </div>
            </button>
          );
        })}
      </div>

      <EmailComposer />

      <section className="mt-10">
        <h2 className="text-[21px] font-bold">Reps between officer sessions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PEER_OPTIONS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => openResource(p.title)}
              className={cn(cardClass, "p-4 text-left hover:border-primary", focusRing)}
            >
              <div className="flex items-center gap-1.5 text-base font-semibold">
                {!isMember && !findResource(p.title)?.resource.isPaid && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                )}
                {p.title.replace(" (formerly Exponent)", "")}
              </div>
              <div className="mt-1 text-sm leading-snug text-foreground/75">{p.note}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <PresidencyConnect />
      </div>

      <div className="rounded-xl bg-muted p-4 text-[15px]">
        <b>Landed an offer?</b> Tell an officer you are open to running mocks for younger members. That is how the club keeps
        working.
      </div>
    </div>
  );
};

export default PeopleView;

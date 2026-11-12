import { ArrowRight, Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePrep } from "@/hooks/usePrepState";
import { PRESIDENCY } from "@/lib/officers";
import { PEER_OPTIONS, SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import { STEP_BY_ID, fmtDate, isOptional, routeFor, type SavedPlan } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { Eyebrow, OfficerAvatar, cardClass, focusRing, linkClass } from "../shared";

const PersonBlock = ({ plan, stepId }: { plan: SavedPlan; stepId: string }) => {
  const { isMember, asked, openAsk, openResource, goStep } = usePrep();
  const step = STEP_BY_ID[stepId];
  const tp = step.touchpoint;

  if (tp && tp.where === "presidency") {
    const kind = tp.kind as SessionKind;
    const session = SESSION_KINDS[kind];
    const route = routeFor(stepId, kind);
    const ask = asked[stepId];
    const locked = !isMember && !session.openToNonMembers;
    return (
      <section className={cn(cardClass, "mt-8 border-2 border-primary p-5 md:p-6")}>
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex shrink-0 -space-x-2">
            {route.slice(0, 2).map((n) => (
              <OfficerAvatar key={n} name={n} className="h-12 w-12 ring-2 ring-card" />
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <Eyebrow className="text-accent">Do this step with a person</Eyebrow>
            <h3 className="mt-0.5 text-xl font-bold">{tp.label}</h3>
            <p className="mt-1 text-[15px] text-foreground/80">{tp.detail}</p>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-3">
                <Eyebrow>Bring</Eyebrow>
                <ul className="mt-1 space-y-0.5">
                  {session.bring.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <Eyebrow>You leave with</Eyebrow>
                <ul className="mt-1 space-y-0.5">
                  {session.leave.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {route.map((n) => `${n}, ${PRESIDENCY.find((o) => o.name === n)?.position ?? ""}`).join(" · ")}
            </p>
          </div>
          <div className="shrink-0">
            {ask ? (
              <span className="inline-flex items-center gap-1.5 text-sm">
                <Check className="h-4 w-4" aria-hidden="true" /> Asked {ask.officer} on {fmtDate(new Date(ask.at))}
              </span>
            ) : locked ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" aria-hidden="true" /> For members
              </span>
            ) : (
              <Button onClick={() => openAsk({ stepId, kind })}>
                Ask for this <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (tp) {
    return (
      <section className={cn(cardClass, "mt-8 flex flex-col gap-4 p-5 sm:flex-row sm:items-center")}>
        <div className="flex-1">
          <Eyebrow className="text-accent">With people{isOptional(plan, stepId) ? ", if it fits" : ""}</Eyebrow>
          <h3 className="mt-0.5 text-[19px] font-bold">{tp.label}</h3>
          <p className="mt-1 text-[15px] text-foreground/80">{tp.detail}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={tp.where === "hackathon" ? "/hackathon" : "/events"}>
            {tp.where === "hackathon" ? "See the hackathon" : "See events"}
          </Link>
        </Button>
      </section>
    );
  }

  if (step.stage === "interview" || step.stage === "offer") {
    return (
      <section className={cn(cardClass, "mt-8 p-5")}>
        <Eyebrow className="text-accent">Practice out loud with a person</Eyebrow>
        <h3 className="mt-0.5 text-[19px] font-bold">Reps first with peers, then an officer mock</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PEER_OPTIONS.slice(0, 2).map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => openResource(p.title)}
              className={cn("rounded-lg border border-border p-3 text-left hover:border-primary", focusRing)}
            >
              <div className="flex items-center gap-1.5 text-[15px] font-semibold">
                {!isMember && <Lock className="h-3.5 w-3.5" aria-hidden="true" />}
                {p.title}
              </div>
              <div className="text-sm text-foreground/75">{p.note}</div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Officer mocks live in{" "}
          <button type="button" onClick={() => goStep("int-mocks")} className={cn(linkClass, focusRing)}>
            Do live mock interviews
          </button>
          , so the officers' time goes where it helps most.
        </p>
      </section>
    );
  }

  return null;
};

export default PersonBlock;

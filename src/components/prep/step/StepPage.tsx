import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, Clock, Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePrep } from "@/hooks/usePrepState";
import {
  STAGE_BY_ID,
  STEP_BY_ID,
  VIDEO_BY_ID,
  VISIBLE_TOPICS,
  currentPhaseIndex,
  freeStep,
  isOptional,
  isStepDone,
  isStepLocked,
  makePlan,
  phaseIndexOf,
  phasesFor,
  planOrder,
  sideLaneSteps,
  stepTime,
  stepVideoIds,
} from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { Chip, cardClass, focusRing } from "../shared";
import CasePrompts from "./CasePrompts";
import CurriculumRail from "./CurriculumRail";
import GoDeeper from "./GoDeeper";
import PersonBlock from "./PersonBlock";
import PickedVideos from "./PickedVideos";
import RoundGuide from "./RoundGuide";
import StepChecklist from "./StepChecklist";

const StepPage = ({ stepId }: { stepId: string }) => {
  const { plan: saved, isMember, checks, today, goStep, goTab, goJoin, setStepDone } = usePrep();
  const plan = saved ?? makePlan("one-year", today);
  const step = STEP_BY_ID[stepId];
  const stage = STAGE_BY_ID[step.stage];

  const order = planOrder(plan);
  const i = order.indexOf(stepId);
  const prev = i > 0 ? order[i - 1] : null;
  const next = i >= 0 && i < order.length - 1 ? order[i + 1] : null;

  const phases = phasesFor(plan);
  const cur = currentPhaseIndex(plan, phases, today);
  const pi = phaseIndexOf(phases, stepId);
  const ph = pi >= 0 ? phases[pi] : null;
  const timing = !ph
    ? sideLaneSteps(plan).includes(stepId)
      ? "Side lane: only if you are still applying."
      : "Not on your plan's timeline. Open it any time."
    : ph.event
      ? ph.label
      : pi > cur
        ? `Scheduled for ${ph.label.toLowerCase()} (${ph.sub}). Starting early is fine.`
        : pi < cur
          ? `From ${ph.label.toLowerCase()}. Catch up when you can.`
          : `On schedule for ${ph.label.toLowerCase()}.`;

  const locked = isStepLocked(stepId, saved, isMember);
  const free = !isMember && stepId === freeStep(saved);
  const freeHasPlaybook = free && step.links.some((l) => l.kind === "playbook");
  const videoIds = stepVideoIds(stepId);
  const minutes = videoIds.reduce((n, id) => n + (VIDEO_BY_ID.get(id)?.minutes ?? 0), 0);
  const inStage = order.filter((id) => STEP_BY_ID[id].stage === step.stage);
  const guideTopic = step.roundPicks?.length === 1 ? VISIBLE_TOPICS.find((t) => t.slug === step.roundPicks?.[0]) : undefined;
  const done = isStepDone(checks, stepId);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:py-8 lg:grid-cols-[290px_minmax(0,1fr)]">
      <CurriculumRail plan={plan} activeId={stepId} />
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <button type="button" onClick={() => goTab("plan")} className={cn("hover:text-foreground hover:underline", focusRing)}>
            My plan
          </button>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{stage.title}</span>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium text-foreground">{step.title}</span>
        </nav>

        <header className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Chip tone="primary">{stage.title}</Chip>
            {inStage.includes(stepId) && (
              <Chip>
                Step {inStage.indexOf(stepId) + 1} of {inStage.length} in this stage
              </Chip>
            )}
            {isOptional(plan, stepId) && <Chip className="text-muted-foreground">If it fits</Chip>}
            {free && (
              <Chip tone="secondary">
                {freeHasPlaybook
                  ? "Free step. Open to everyone except the APM Playbook."
                  : "Free step. Everything here is open."}
              </Chip>
            )}
          </div>
          <h1 className="mt-3 text-[30px] font-extrabold leading-[1.1] md:text-[40px]">{step.title}</h1>
          <p className="mt-3 max-w-3xl text-[19px] leading-relaxed text-foreground/85">{step.goal}</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {stepTime(saved, stepId)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {timing}
            </span>
            {videoIds.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {videoIds.length} {videoIds.length === 1 ? "video" : "videos"}, {minutes} min
              </span>
            )}
          </div>
        </header>

        {locked && (
          <div className={cn(cardClass, "mt-5 flex flex-col gap-3 border-dashed p-4 sm:flex-row sm:items-center")}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="flex-1 text-[15px]">
              <b>Your checklist works now and saves on this device.</b> The videos and links below open when an officer approves
              your membership.
            </div>
            <Button variant="outline" onClick={goJoin}>
              How joining works
            </Button>
          </div>
        )}

        <StepChecklist stepId={stepId} />
        <PickedVideos stepId={stepId} locked={locked} />
        {guideTopic && <RoundGuide topic={guideTopic} locked={locked} />}
        <CasePrompts stepId={stepId} locked={locked} />
        <GoDeeper stepId={stepId} locked={locked} />
        <PersonBlock plan={plan} stepId={stepId} />

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <button
              type="button"
              onClick={() => goStep(prev)}
              className={cn("inline-flex items-center gap-2 text-left text-sm text-muted-foreground hover:text-foreground", focusRing)}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>
                <span className="block">Previous</span>
                <span className="font-semibold text-foreground">{STEP_BY_ID[prev].title}</span>
              </span>
            </button>
          ) : (
            <span />
          )}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={done ? "outline" : "default"}
              onClick={() => {
                setStepDone(stepId, !done);
                if (!done) toast("Step done. Nice.");
              }}
            >
              {done ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" /> Done
                </>
              ) : (
                "Mark step done"
              )}
            </Button>
            {next && (
              <Button variant="outline" onClick={() => goStep(next)}>
                Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default StepPage;

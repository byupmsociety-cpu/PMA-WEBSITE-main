import { useState } from "react";
import { Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePrep } from "@/hooks/usePrepState";
import { OFFICER_NOTES, SESSION_KINDS, type SessionKind } from "@/lib/prepJourney";
import { PRESIDENCY } from "@/lib/officers";
import { STEP_BY_ID, routeFor, weekInfo } from "@/lib/prepPlan";
import { NON_EMPTY_CATEGORIES } from "@/lib/resourceCatalog";
import { PLAYBOOK_STEPS } from "@/lib/apmPlaybook";
import { VIDEO_LIBRARY } from "@/lib/videoLibrary";
import { cn } from "@/lib/utils";
import { ASIDE_QUERIES, firstName } from "../copy";
import { Chip, Eyebrow, OfficerAvatar, cardClass, focusRing, linkClass } from "../shared";

const TOPICS_WITH_VIDEOS = VIDEO_LIBRARY.filter((t) => t.videos.some((v) => !v.fromCourse));
const VISIBLE_VIDEOS = TOPICS_WITH_VIDEOS.reduce((n, t) => n + t.videos.filter((v) => !v.fromCourse).length, 0);

export const LibraryMini = () => {
  const { isMember, goLibrary } = usePrep();
  const [value, setValue] = useState("");
  const rowClass = cn("flex w-full items-center justify-between py-2 text-left hover:text-secondary", focusRing);

  return (
    <div className={cn(cardClass, "p-5")}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Deep dive library</h2>
        {!isMember && (
          <Chip className="text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden="true" /> Members
          </Chip>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Every step, guide, video and resource. Search in your own words.</p>
      <form
        className="relative mt-3"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          goLibrary({ q: value.trim() || undefined });
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Try case interview"
          aria-label="Search the library"
          className="bg-background pl-9 text-[15px]"
        />
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ASIDE_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => goLibrary({ q })}
            className={cn("min-h-8 rounded-full border border-border px-2.5 py-1 text-[13px] hover:border-primary", focusRing)}
          >
            {q}
          </button>
        ))}
      </div>
      <Eyebrow className="mt-4">Browse</Eyebrow>
      <ul className="mt-1 divide-y divide-border text-[15px]">
        <li>
          <button type="button" className={rowClass} onClick={() => goLibrary({ playbook: PLAYBOOK_STEPS[0].id })}>
            <span>APM Playbook</span>
            <span className="text-[13px] text-muted-foreground">{PLAYBOOK_STEPS.length} steps</span>
          </button>
        </li>
        <li>
          <button type="button" className={rowClass} onClick={() => goLibrary({}, { scroll: "practice-interviews" })}>
            <span>Practice Interviews</span>
            <span className="text-[13px] text-muted-foreground">
              {TOPICS_WITH_VIDEOS.length} rounds, {VISIBLE_VIDEOS} videos
            </span>
          </button>
        </li>
        {NON_EMPTY_CATEGORIES.map((c) => (
          <li key={c.id}>
            <button type="button" className={rowClass} onClick={() => goLibrary({ cat: c.id })}>
              <span>{c.title}</span>
              <span className="text-[13px] text-muted-foreground">{c.resources.length}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PersonCard = () => {
  const { plan, checks, isMember, today, openAsk, goTab } = usePrep();
  const stepId = (plan && weekInfo(plan, checks, isMember, today).human) || "explore-officer-chat";
  const step = STEP_BY_ID[stepId];
  const kind = (step.touchpoint?.kind ?? "coffee-chat") as SessionKind;
  const name = routeFor(stepId, kind)[0];
  const officer = PRESIDENCY.find((o) => o.name === name);

  return (
    <div className={cn(cardClass, "p-5")}>
      <Eyebrow>Your person right now</Eyebrow>
      <div className="mt-3 flex items-center gap-3">
        <OfficerAvatar name={name} className="h-11 w-11" />
        <div className="min-w-0">
          <div className="text-base font-semibold leading-tight">{name}</div>
          <div className="text-[13px] text-muted-foreground">{officer?.position}</div>
        </div>
      </div>
      <p className="mt-2 text-sm text-foreground/80">
        {step.touchpoint?.label}. {OFFICER_NOTES[name] ?? ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <button type="button" className={cn(linkClass, "min-h-8", focusRing)} onClick={() => openAsk({ stepId, kind })}>
          Ask {firstName(name)}
        </button>
        <button
          type="button"
          className={cn("min-h-8 text-muted-foreground hover:text-foreground", focusRing)}
          onClick={() => goTab("people")}
        >
          All {PRESIDENCY.length} officers
        </button>
      </div>
      {!isMember && !SESSION_KINDS[kind].openToNonMembers && (
        <p className="mt-2 text-[13px] text-muted-foreground">
          {SESSION_KINDS[kind].label}s are for members. Coffee chats are open to anyone.
        </p>
      )}
    </div>
  );
};

export const HowItWorks = ({ onEdit }: { onEdit: () => void }) => (
  <div className={cn(cardClass, "p-5 text-[15px]")}>
    <Eyebrow>How this plan works</Eyebrow>
    <ul className="mt-2 space-y-1.5 text-muted-foreground">
      <li>This week pulls from your earliest unfinished steps. The calendar only tells you if you are on pace.</li>
      <li>Saved on this device. Checkmarks live in this browser, so no account is needed to start.</li>
      <li>Behind? Nothing locks. Pick up where you left off.</li>
    </ul>
    <button type="button" onClick={onEdit} className={cn(linkClass, "mt-3 min-h-8 text-sm font-normal", focusRing)}>
      Change your answers
    </button>
  </div>
);

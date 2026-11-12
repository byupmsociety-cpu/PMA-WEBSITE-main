import { BookOpen, Briefcase, Layers, Lock, Video, type LucideIcon } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import { PLAYBOOK_STEPS } from "@/lib/apmPlaybook";
import type { JourneyLink } from "@/lib/prepJourney";
import { STEP_BY_ID, VISIBLE_TOPICS } from "@/lib/prepPlan";
import { findResource } from "@/lib/resourceCatalog";
import { cn } from "@/lib/utils";
import { cardClass, focusRing } from "../shared";

interface DeeperItem {
  key: string;
  type: string;
  label: string;
  sub: string;
  Icon: LucideIcon;
  paid?: boolean;
  open: () => void;
  /** Free to open for non members (resources in the free step, paid partner perks). */
  openForAll?: boolean;
}

const INTERVIEWS_SUB = "The 5 case types with frameworks, plus STPAR and 6 behavioral themes.";

const GoDeeper = ({ stepId, locked }: { stepId: string; locked: boolean }) => {
  const { isMember, openResource, goLibrary, goJoin } = usePrep();
  const step = STEP_BY_ID[stepId];

  const links: JourneyLink[] = step.links.filter((l) => l.kind !== "video");
  if (step.roundPicks?.length === 1 && !links.some((l) => l.kind === "topic" && l.slug === step.roundPicks?.[0])) {
    links.unshift({ kind: "topic", slug: step.roundPicks[0] });
  }

  const items = links.flatMap((l): DeeperItem[] => {
    if (l.kind === "resource") {
      const found = findResource(l.title);
      if (!found) return [];
      const { resource, category } = found;
      return [
        {
          key: `r-${resource.title}`,
          type: category.title,
          label: resource.title,
          sub: resource.description,
          Icon: resource.isPaid ? Briefcase : BookOpen,
          paid: resource.isPaid,
          openForAll: resource.isPaid || !locked,
          open: () => openResource(resource.title, { free: !locked }),
        },
      ];
    }
    if (l.kind === "playbook") {
      const pb = PLAYBOOK_STEPS.find((s) => s.id === l.id);
      if (!pb) return [];
      return [
        {
          key: `p-${pb.id}`,
          type: `APM Playbook, step ${pb.number}`,
          label: pb.title,
          sub: pb.id === "interviews" ? INTERVIEWS_SUB : pb.lede,
          Icon: Layers,
          // The APM Playbook keeps its members only gating, even inside the free step.
          openForAll: false,
          open: () => goLibrary({ playbook: pb.id }),
        },
      ];
    }
    if (l.kind === "topic") {
      const t = VISIBLE_TOPICS.find((x) => x.slug === l.slug);
      if (!t) return [];
      return [
        {
          key: `t-${t.slug}`,
          type: "Practice interviews",
          label: `All ${t.videos.length} ${t.title} videos`,
          sub: `${t.description}.${t.guide ? " Includes the round guide." : ""}`,
          Icon: Video,
          openForAll: false,
          open: () => goLibrary({ topic: t.slug }),
        },
      ];
    }
    return [];
  });

  const unique = items.filter((x, i, a) => a.findIndex((y) => y.key === x.key) === i);
  if (unique.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-[21px] font-bold">Go deeper</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {unique.map((x) => {
          const isLocked = !isMember && !x.openForAll;
          const Icon = isLocked ? Lock : x.Icon;
          return (
            <button
              key={x.key}
              type="button"
              onClick={isLocked ? goJoin : x.open}
              className={cn(cardClass, "flex gap-3 p-4 text-left hover:border-primary", focusRing)}
            >
              <span className="grid h-9 w-9 shrink-0 place-content-center rounded-lg bg-muted">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {x.type}
                  {x.paid ? " · Partner perk" : ""}
                </span>
                <span className="mt-0.5 block text-base font-semibold leading-snug">{x.label}</span>
                <span className="mt-1 block text-sm leading-snug text-foreground/75">{x.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GoDeeper;

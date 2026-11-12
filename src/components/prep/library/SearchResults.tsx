import { ArrowRight, Layers, Lock, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrep } from "@/hooks/usePrepState";
import { CASE_TYPES } from "@/lib/apmPlaybook";
import {
  PICKS_BY_TOPIC,
  ROUND_OPTIONS,
  STAGE_BY_ID,
  STEP_BY_ID,
  VIDEO_BY_ID,
  VISIBLE_TOPICS,
  isStepDone,
  phaseIndexOf,
  phasesFor,
} from "@/lib/prepPlan";
import type { SearchResult } from "@/lib/prepSearch";
import { findResource } from "@/lib/resourceCatalog";
import { cn } from "@/lib/utils";
import { Chip, cardClass, focusRing } from "../shared";
import PickVideoCard from "../step/PickVideoCard";

const INTERVIEWS_SUB = "The 5 case types with frameworks, plus STPAR and 6 behavioral themes.";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-8">
    <h3 className="text-[19px] font-bold">{title}</h3>
    <div className="mt-3">{children}</div>
  </section>
);

const SearchResults = ({ result, onQuery }: { result: SearchResult; onQuery: (q: string) => void }) => {
  const { plan, checks, isMember, goStep, goLibrary, goJoin, goTab, openResource, openAsk } = usePrep();
  const locked = !isMember;

  if (result.total === 0) {
    return (
      <div className={cn(cardClass, "p-5 sm:p-6")}>
        <h3 className="text-xl font-bold">Nothing matched "{result.raw}" yet.</h3>
        <p className="mt-1 text-base text-foreground/80">
          Pick the round you are prepping for, start with the step most people need first, or ask a person.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROUND_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => onQuery(r.label)}
              className={cn("min-h-10 rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary", focusRing)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => goStep("int-basics")}>
            Learn how PM interviews work <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" onClick={() => openAsk({ kind: "coffee-chat" })}>
            <User className="h-4 w-4" aria-hidden="true" /> Ask an officer
          </Button>
        </div>
      </div>
    );
  }

  const whereInPlan = (id: string) => {
    if (!plan) return null;
    const phases = phasesFor(plan);
    const i = phaseIndexOf(phases, id);
    return i < 0 ? null : phases[i].label;
  };

  const best = result.steps[0] ? STEP_BY_ID[result.steps[0].id] : null;
  const bestVideos: { id: string; role: string }[] = best
    ? best.roundPicks
      ? (PICKS_BY_TOPIC[best.roundPicks[0]]?.videos ?? []).map((v) => ({ id: v.youtubeId, role: v.role }))
      : best.links.flatMap((l) => (l.kind === "video" ? [{ id: l.youtubeId, role: "" }] : []))
    : [];
  const shownVideos = bestVideos.filter((v) => VIDEO_BY_ID.has(v.id));
  const bestWhere = best ? whereInPlan(best.id) : null;
  const bestTopic = best?.roundPicks?.length === 1 ? VISIBLE_TOPICS.find((t) => t.slug === best.roundPicks?.[0]) : undefined;
  const topics = result.topics
    .slice(0, 2)
    .map((x) => VISIBLE_TOPICS.find((t) => t.slug === x.id))
    .filter((t): t is (typeof VISIBLE_TOPICS)[number] => !!t);
  const videos = result.videos.filter((v) => !shownVideos.some((b) => b.id === v.id)).slice(0, 3);
  const cases = result.cases.slice(0, 5).flatMap((c) => CASE_TYPES.filter((x) => x.id === c.id));

  return (
    <div>
      <div className="text-sm text-muted-foreground" aria-live="polite">
        {result.total} results for <b className="text-foreground">"{result.raw}"</b>
      </div>
      {result.bridge && <p className="mt-2 max-w-3xl rounded-lg bg-muted px-3 py-2 text-[15px]">{result.bridge}</p>}

      {best && (
        <section className={cn(cardClass, "mt-4 border-2 border-primary p-5 md:p-6")}>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="primary">Best match</Chip>
            <Chip>
              {bestWhere
                ? `In your plan: ${bestWhere}${isStepDone(checks, best.id) ? ", done" : ""}`
                : `Step · ${STAGE_BY_ID[best.stage].title}`}
            </Chip>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold">{best.title}</h3>
          <p className="mt-1 text-base text-foreground/85">{best.goal}</p>
          {shownVideos.length > 0 && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {shownVideos.map(({ id, role }) => {
                const v = VIDEO_BY_ID.get(id);
                if (!v) return null;
                const inner = (
                  <>
                    <span className="relative block aspect-video overflow-hidden rounded-md bg-primary">
                      {locked ? (
                        <span className="absolute inset-0 grid place-content-center text-primary-foreground">
                          <Lock className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : (
                        <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 text-[11px] font-semibold text-white">
                        {v.minutes} min
                      </span>
                    </span>
                    {role && <span className="mt-2 block text-xs font-semibold text-accent">{role}</span>}
                    <span className={cn("block text-sm font-semibold leading-snug", !role && "mt-2")}>{v.title}</span>
                  </>
                );
                const cls = cn("block rounded-lg border border-border p-2.5 text-left hover:border-primary", focusRing);
                return locked ? (
                  <button key={id} type="button" onClick={goJoin} className={cls} aria-label={`${v.title}, members only`}>
                    {inner}
                  </button>
                ) : (
                  <a key={id} href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                );
              })}
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => goStep(best.id)}>
              Open this step <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            {bestTopic && (
              <Button variant="outline" onClick={() => (locked ? goJoin() : goLibrary({ topic: bestTopic.slug }))}>
                Read the {bestTopic.title} guide
              </Button>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 self-center text-sm text-muted-foreground">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Videos open with membership
              </span>
            )}
          </div>
        </section>
      )}

      {result.steps.length > 1 && (
        <Section title="More steps">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.steps.slice(1, 5).map((x) => {
              const s = STEP_BY_ID[x.id];
              const where = whereInPlan(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goStep(s.id)}
                  className={cn(cardClass, "p-4 text-left hover:border-primary", focusRing)}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {STAGE_BY_ID[s.stage].title}
                    {where ? ` · ${where}` : ""}
                  </div>
                  <div className="mt-0.5 text-base font-semibold">{s.title}</div>
                  <div className="mt-1 text-sm text-foreground/75">{s.goal}</div>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {(result.playbook.length > 0 || cases.length > 0) && (
        <Section title="APM Playbook">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.playbook.slice(0, 1).map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => (locked ? goJoin() : goLibrary({ playbook: x.id }))}
                className={cn(cardClass, "flex gap-3 p-4 text-left hover:border-primary", focusRing)}
              >
                <span className="grid h-9 w-9 shrink-0 place-content-center rounded-lg bg-muted">
                  {locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Layers className="h-4 w-4" aria-hidden="true" />}
                </span>
                <span>
                  <span className="block text-base font-semibold">{x.title}</span>
                  <span className="mt-1 block text-sm text-foreground/75">{x.id === "interviews" ? INTERVIEWS_SUB : x.sub}</span>
                </span>
              </button>
            ))}
            {cases.length > 0 && (
              <div className={cn(cardClass, "p-4")}>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Case types</div>
                <ul className="mt-1.5 space-y-1.5">
                  {cases.map((c) => (
                    <li key={c.id} className="text-[15px]">
                      <span className="font-semibold">{c.title}</span>
                      {!locked && <span className="text-foreground/70"> "{c.examples[0]}"</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {(topics.length > 0 || videos.length > 0) && (
        <Section title="Practice interview videos">
          <div className="grid gap-3">
            {topics.map((t) => (
              <div key={t.slug} className={cn(cardClass, "flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center")}>
                <div>
                  <div className="text-base font-semibold">{t.title}</div>
                  <div className="text-sm text-foreground/75">
                    {t.description}. {PICKS_BY_TOPIC[t.slug as keyof typeof PICKS_BY_TOPIC] ? "Picks to start, " : ""}
                    {t.videos.length} {t.videos.length === 1 ? "video" : "videos"} in all{t.guide ? ", with a round guide" : ""}.
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={() => (locked ? goJoin() : goLibrary({ topic: t.slug }))}
                >
                  {locked ? (
                    <>
                      <Lock className="h-4 w-4" aria-hidden="true" /> Members
                    </>
                  ) : (
                    `Open ${t.title}`
                  )}
                </Button>
              </div>
            ))}
            {videos.map((v) => (
              <PickVideoCard
                key={v.id}
                youtubeId={v.id}
                role={v.pick ? "Picked" : null}
                note={VISIBLE_TOPICS.find((t) => t.slug === v.topic)?.title ?? null}
                locked={locked}
              />
            ))}
          </div>
        </Section>
      )}

      {result.resources.length > 0 && (
        <Section title="Books, tools and communities">
          <div className="grid gap-3 sm:grid-cols-2">
            {result.resources.slice(0, 4).map((x) => {
              const found = findResource(x.id);
              if (!found) return null;
              const { resource, category } = found;
              const isLocked = locked && !resource.isPaid;
              return (
                <button
                  key={resource.title}
                  type="button"
                  onClick={() => openResource(resource.title)}
                  className={cn(cardClass, "block p-4 text-left hover:border-primary", focusRing)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category.title}</span>
                    {resource.isPaid && <Chip className="text-accent">Partner perk</Chip>}
                    {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-label="Members only" />}
                  </div>
                  <div className="mt-0.5 text-base font-semibold">{resource.title}</div>
                  <div className="mt-1 text-sm leading-snug text-foreground/75">{resource.description}</div>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <section className="mt-8 flex flex-col gap-3 rounded-xl bg-muted p-4 sm:flex-row sm:items-center">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card">
          <Users className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex-1 text-[15px]">
          <b>Rather practice with a person?</b> Peers first (Aced gives 5 free mocks a month), then an officer mock before the
          real one.
        </div>
        <Button variant="outline" onClick={() => goTab("people")}>
          Talk to a person
        </Button>
      </section>
    </div>
  );
};

export default SearchResults;

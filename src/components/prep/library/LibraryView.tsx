import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApmPlaybook from "@/components/resources/ApmPlaybook";
import PracticeInterviews from "@/components/resources/PracticeInterviews";
import ResourcesFeedback from "@/components/resources/ResourcesFeedback";
import { usePrep } from "@/hooks/usePrepState";
import { normalizeQuery, searchPrep } from "@/lib/prepSearch";
import { NON_EMPTY_CATEGORIES } from "@/lib/resourceCatalog";
import { cn } from "@/lib/utils";
import { LIBRARY_QUERIES, QUICK_LINKS } from "../copy";
import { cardClass, focusRing, linkClass } from "../shared";
import CategoryDetail from "./CategoryDetail";
import SearchResults from "./SearchResults";

const LibraryView = () => {
  const { isMember, plan, q, cat, topic, playbook, watched, toggleWatched, setQuery, goLibrary, goJoin, goTab, openResource } =
    usePrep();
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue((v) => (v.trim() === q.trim() ? v : q));
  }, [q]);

  useEffect(() => {
    if (value.trim() === q.trim()) return;
    const timer = window.setTimeout(() => setQuery(value.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [value, q, setQuery]);

  const result = useMemo(() => searchPrep(value), [value]);

  if (cat) return <CategoryDetail slug={cat} />;

  const runQuery = (next: string) => {
    setValue(next);
    setQuery(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <div className="max-w-3xl">
        <h1 className="text-[26px] font-extrabold md:text-[32px]">Library</h1>
        <p className="mt-1 text-base text-muted-foreground">Every step, video, guide and resource. Search in your own words.</p>
        <form
          role="search"
          className="relative mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(value.trim());
          }}
        >
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="prep-search"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Try case interview, behavioral, resume"
            autoComplete="off"
            aria-label="Search prep"
            className="h-auto rounded-xl border-2 py-3 pl-12 pr-4 text-[17px]"
          />
        </form>
        <div className="no-scrollbar mt-3 overflow-x-auto">
          <div className="flex w-max gap-2 text-sm">
            {LIBRARY_QUERIES.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => runQuery(x)}
                aria-pressed={normalizeQuery(value) === x}
                className={cn(
                  "min-h-9 rounded-full border px-3 py-1",
                  normalizeQuery(value) === x ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary",
                  focusRing,
                )}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isMember && (
        <div className={cn(cardClass, "mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1 text-[15px]">
            <b>You can search and see what is in here.</b> Opening videos, the playbook and resource links needs membership. An
            officer approves new members by hand after you pay dues.
          </div>
          <Button variant="outline" onClick={goJoin}>
            How joining works
          </Button>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <SearchResults result={result} onQuery={runQuery} />
        </div>
      )}

      <div className={cn("space-y-10", result ? "mt-12 border-t border-border pt-8" : "mt-6")}>
        {isMember && !plan && !result && (
          <div className={cn(cardClass, "flex flex-col gap-3 p-4 sm:flex-row sm:items-center")}>
            <div className="flex-1 text-[15px]">
              <b>New here, or helping someone who is?</b> Two questions build a week by week plan from this library.
            </div>
            <Button variant="outline" onClick={() => goTab("plan")}>
              Build a plan
            </Button>
          </div>
        )}

        <section aria-labelledby="prep-categories">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="prep-categories" className="text-[21px] font-bold">
              Resource categories
            </h2>
            <div className="text-sm text-muted-foreground">
              Quick links:{" "}
              {QUICK_LINKS.map((title, i) => (
                <span key={title}>
                  {i > 0 && " · "}
                  <button type="button" onClick={() => openResource(title)} className={cn(linkClass, focusRing)}>
                    {title.replace(" (formerly Exponent)", "")}
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {NON_EMPTY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goLibrary({ cat: c.id })}
                className={cn(cardClass, "group p-4 text-left transition-colors hover:border-primary", focusRing)}
              >
                <span className="grid h-9 w-9 place-content-center rounded-lg bg-primary text-primary-foreground">
                  <c.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="mt-2 font-heading text-base font-bold leading-snug group-hover:text-secondary">{c.title}</div>
                <div className="mt-1 hidden text-[13px] leading-snug text-muted-foreground sm:block">{c.description}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[13px] text-muted-foreground">
                  {!isMember && <Lock className="h-3 w-3" aria-hidden="true" />}
                  {c.resources.length} resources
                  <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </section>

        <PracticeInterviews
          initialTopic={topic ?? undefined}
          watched={watched}
          onToggleWatched={toggleWatched}
          locked={!isMember}
          onLocked={goJoin}
        />

        {isMember ? (
          <ApmPlaybook
            initialStep={playbook ?? undefined}
            onSelectCategory={(slug) => goLibrary({ cat: slug })}
            onOpenResource={(title) => openResource(title)}
          />
        ) : (
          <section
            id="apm-playbook"
            className="mx-auto flex max-w-6xl scroll-mt-24 flex-col justify-between gap-4 rounded-xl bg-primary p-5 text-primary-foreground md:flex-row md:items-center md:p-6"
          >
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">The APM Playbook</div>
              <div className="mt-1 font-heading text-xl font-bold">5 steps to land an APM role</div>
              <div className="mt-1 text-[15px] text-primary-foreground/80">
                From Nathan McCauley's workshop. Experience, resume, networking, applications, interviews.
              </div>
            </div>
            <Button variant="secondary" className="shrink-0 bg-card text-card-foreground hover:bg-muted" onClick={goJoin}>
              <Lock className="h-4 w-4" aria-hidden="true" /> Members only
            </Button>
          </section>
        )}

        <ResourcesFeedback />
      </div>
    </div>
  );
};

export default LibraryView;

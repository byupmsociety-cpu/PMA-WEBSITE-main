import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Download, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BEHAVIORAL_THEMES,
  CASE_TYPES,
  KEY_TAKEAWAYS,
  NETWORK_TIERS,
  PLAYBOOK_DECK_URL,
  PLAYBOOK_STEPS,
  REALITY_STATS,
  RECRUITING_CALENDAR,
  RESUME_REFRAME,
  STPAR,
  TWO_TOUCH,
  WHAT_SETS_YOU_APART,
  type PlaybookLink,
  type PlaybookList,
} from "@/lib/apmPlaybook";
import { RESOURCE_CATEGORIES } from "@/lib/resources";

interface ApmPlaybookProps {
  onSelectCategory: (slug: string) => void;
  onOpenResource: (title: string) => void;
}

const isExternalResource = (title: string) =>
  RESOURCE_CATEGORIES.some((category) =>
    category.resources.some((resource) => resource.title === title && resource.url.trim() !== ""),
  );

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</h4>
);

const StepList = ({ list }: { list: PlaybookList }) => {
  const ListTag = list.ordered ? "ol" : "ul";
  return (
    <div>
      <SubHeading>{list.heading}</SubHeading>
      <ListTag className="space-y-2">
        {list.items.map((item, idx) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
            {list.ordered ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary mt-0.5">
                {idx + 1}
              </span>
            ) : (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            )}
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ListTag>
    </div>
  );
};

const ResumeReframe = () => (
  <div>
    <SubHeading>Reframe the bullet</SubHeading>
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm">
      <span className="rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground line-through">
        {RESUME_REFRAME.before}
      </span>
      <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 font-medium text-foreground">
        {RESUME_REFRAME.after}
      </span>
    </div>
  </div>
);

const NetworkingDetail = () => (
  <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
    <div>
      <SubHeading>Who to target</SubHeading>
      <ol className="space-y-2">
        {NETWORK_TIERS.map(({ tier, who }) => (
          <li key={tier} className="flex items-start gap-3 rounded-md border border-border p-3">
            <span className="w-14 shrink-0 text-xs font-bold uppercase tracking-wider text-primary pt-0.5">{tier}</span>
            <span className="min-w-0 text-sm leading-relaxed text-foreground/90">{who}</span>
          </li>
        ))}
      </ol>
    </div>
    <div>
      <SubHeading>The two touch strategy</SubHeading>
      <ol className="grid gap-3 sm:grid-cols-2">
        {TWO_TOUCH.map((touch) => (
          <li key={touch.label} className="rounded-md border border-border p-4">
            <p className="text-sm font-semibold text-foreground">{touch.label}</p>
            <p className="text-xs text-muted-foreground mb-3">{touch.timing}</p>
            <ul className="space-y-1.5">
              {touch.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

const RecruitingCalendar = () => (
  <div>
    <SubHeading>The recruiting calendar</SubHeading>
    <ol className="grid grid-cols-10 gap-1" aria-label="Recruiting calendar, July through April">
      {RECRUITING_CALENDAR.map(({ month, season }) => (
        <li key={month} className="flex flex-col items-center gap-1 min-w-0">
          <span
            className={`h-8 w-full rounded-sm ${
              season === "peak" ? "bg-primary" : season === "late" ? "bg-primary/15" : "bg-muted border border-border"
            }`}
            aria-hidden="true"
          />
          <span className={`text-[11px] ${season === "peak" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
            {month}
          </span>
          <span className="sr-only">
            {season === "peak" ? "peak season" : season === "late" ? "some roles still open" : "before season"}
          </span>
        </li>
      ))}
    </ol>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground" aria-hidden="true">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
        Peak season: August to October
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary/15" />
        Some roles continue through winter and into spring
      </span>
    </div>
  </div>
);

const InterviewDetail = () => {
  const [caseType, setCaseType] = useState(CASE_TYPES[0].id);

  return (
    <div className="space-y-8">
      <div>
        <SubHeading>Behavioral framework: STPAR</SubHeading>
        <ol className="grid grid-cols-5 gap-1.5">
          {STPAR.map(({ letter, word }) => (
            <li key={letter} className="flex flex-col items-center rounded-md border border-border py-2 px-1 min-w-0">
              <span className="font-heading text-xl font-extrabold text-primary" aria-hidden="true">
                {letter}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground truncate max-w-full">{word}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <SubHeading>Six behavioral themes to prepare</SubHeading>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BEHAVIORAL_THEMES.map((theme, idx) => (
            <li key={theme.title} className="flex gap-3 rounded-md border border-border p-3">
              <span className="text-xs font-bold text-primary pt-0.5">{idx + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{theme.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{theme.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <SubHeading>Five case question types</SubHeading>
        <Tabs value={caseType} onValueChange={setCaseType}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">
            {CASE_TYPES.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="text-xs sm:text-sm">
                {type.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {CASE_TYPES.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-3 rounded-md border border-border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Example</p>
                  <ul className="space-y-1.5">
                    {type.examples.map((example) => (
                      <li key={example} className="text-sm italic leading-relaxed text-foreground/90">
                        "{example}"
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Framework</p>
                  <ol className="flex flex-wrap items-center gap-1.5" aria-label={`${type.title} framework`}>
                    {type.framework.map((part, idx) => (
                      <li key={part} className="flex items-center gap-1.5">
                        {idx > 0 &&
                          (type.sequential ? (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          ) : (
                            <span className="text-muted-foreground" aria-hidden="true">
                              ·
                            </span>
                          ))}
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {part}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const StepDetail = ({ stepId }: { stepId: string }) => {
  switch (stepId) {
    case "resume":
      return <ResumeReframe />;
    case "networking":
      return <NetworkingDetail />;
    case "applications":
      return <RecruitingCalendar />;
    case "interviews":
      return <InterviewDetail />;
    default:
      return null;
  }
};

const ApmPlaybook = ({ onSelectCategory, onOpenResource }: ApmPlaybookProps) => {
  const [activeStep, setActiveStep] = useState(PLAYBOOK_STEPS[0].id);
  const activeIndex = PLAYBOOK_STEPS.findIndex((step) => step.id === activeStep);

  const openLink = (link: PlaybookLink) => {
    if (link.kind === "category") onSelectCategory(link.slug);
    else onOpenResource(link.title);
  };

  return (
    <AnimatedSection animation="fade-in">
      <section aria-labelledby="apm-playbook-title" className="max-w-6xl mx-auto mb-12">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 md:p-8">
            <h2 id="apm-playbook-title" className="text-2xl md:text-3xl font-extrabold text-card-foreground">
              The APM Playbook
            </h2>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              From Nathan McCauley's workshop. Nathan landed a Google APM offer.
            </p>
            <a
              href={PLAYBOOK_DECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-secondary underline-offset-4 hover:underline"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download the full deck (PDF)
            </a>
          </div>

          <div className="bg-primary text-primary-foreground px-5 py-6 md:px-8">
            <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:gap-10">
              <ul className="grid gap-5 sm:grid-cols-3">
                {REALITY_STATS.map((stat) => (
                  <li key={stat.value} className="min-w-0">
                    <p className="font-heading text-2xl md:text-3xl font-extrabold leading-tight break-words">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">{stat.label}</p>
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80 mb-2">
                  What sets you apart
                </p>
                <ol className="space-y-1.5">
                  {WHAT_SETS_YOU_APART.map((item, idx) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span className="font-bold">{idx + 1}</span>
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-5">
              <h3 className="text-lg md:text-xl font-bold text-card-foreground">5 steps to land an APM role</h3>
              <p className="text-sm text-muted-foreground">There is no silver bullet. Do all 5 consistently.</p>
            </div>

            <Tabs value={activeStep} onValueChange={setActiveStep}>
              <TabsList className="relative grid h-auto w-full grid-cols-5 gap-1 bg-transparent p-0 before:absolute before:left-[10%] before:right-[10%] before:top-5 before:h-px before:bg-border">
                {PLAYBOOK_STEPS.map((step, idx) => {
                  const isActive = step.id === activeStep;
                  const isDone = idx < activeIndex;
                  return (
                    <TabsTrigger
                      key={step.id}
                      value={step.id}
                      aria-label={`Step ${step.number}: ${step.title}`}
                      className="relative flex h-auto flex-col items-center gap-2 rounded-md px-1 py-0 whitespace-normal data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : isDone
                              ? "border-primary/40 bg-card text-primary"
                              : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {step.number}
                      </span>
                      <span
                        className={`hidden sm:block text-xs md:text-sm text-center leading-tight ${
                          isActive ? "font-semibold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.shortTitle}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {PLAYBOOK_STEPS.map((step, idx) => {
                const prev = PLAYBOOK_STEPS[idx - 1];
                const next = PLAYBOOK_STEPS[idx + 1];
                return (
                  <TabsContent key={step.id} value={step.id} className="mt-6 rounded-lg border border-border p-4 md:p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Step {step.number} of {PLAYBOOK_STEPS.length}
                    </p>
                    <h4 className="mt-1 text-lg md:text-xl font-bold text-card-foreground">{step.title}</h4>
                    <p className="mt-2 text-base leading-relaxed text-foreground/90">{step.lede}</p>

                    <div className="mt-6 space-y-6">
                      {step.lists.length > 0 && (
                        <div className={`grid gap-6 ${step.lists.length > 1 ? "md:grid-cols-2" : ""}`}>
                          {step.lists.map((list) => (
                            <StepList key={list.heading} list={list} />
                          ))}
                        </div>
                      )}
                      <StepDetail stepId={step.id} />
                    </div>

                    <p className="mt-6 border-l-4 border-primary pl-4 text-base font-semibold text-foreground">
                      {step.callout}
                    </p>

                    {step.links.length > 0 && (
                      <div className="mt-6">
                        <SubHeading>Resources for this step</SubHeading>
                        <div className="flex flex-wrap gap-2">
                          {step.links.map((link) => {
                            const external = link.kind === "resource" && isExternalResource(link.title);
                            return (
                              <Button
                                key={link.label}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => openLink(link)}
                              >
                                {link.label}
                                {external ? (
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                ) : (
                                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4">
                      {prev ? (
                        <Button variant="ghost" size="sm" onClick={() => setActiveStep(prev.id)} className="min-w-0">
                          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                          <span className="truncate">{prev.shortTitle}</span>
                        </Button>
                      ) : (
                        <span />
                      )}
                      {next && (
                        <Button variant="ghost" size="sm" onClick={() => setActiveStep(next.id)} className="min-w-0">
                          <span className="truncate">Next: {next.shortTitle}</span>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

          <div className="border-t border-border bg-muted/50 px-5 py-6 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Key takeaways</p>
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {KEY_TAKEAWAYS.map((takeaway, idx) => (
                <li key={takeaway.title} className="min-w-0">
                  <span className="font-heading text-sm font-extrabold text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">{takeaway.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{takeaway.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
};

export default ApmPlaybook;

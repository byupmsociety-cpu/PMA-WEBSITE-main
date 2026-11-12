import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { CASE_ANSWER_KEY as KEY } from "@/lib/caseAnswerKey";

const JOIN_PMA_URL = "https://clubs.byu.edu/link/club/18295873486206095";
const SLACK_URL = "https://join.slack.com/t/byu-pma/shared_invite/zt-4a760gf8j-aObyA0ZHlvDNJbOA19Yk5A";

const eyebrow = "text-sm font-semibold uppercase tracking-wider text-muted-foreground";
const card = "rounded-xl border border-border bg-card text-card-foreground p-6 md:p-8";
const textLink = "font-medium text-secondary underline underline-offset-4 hover:opacity-80";

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "");

const CaseAnswerKeyPage = () => (
  <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
    <div className="container mx-auto px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection animation="slide-up">
          <header className="mb-10">
            <p className={`${eyebrow} mb-4`}>Case Interview: Build the Fix with AI · Answer key</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{KEY.title}</h1>
            <p className="text-lg leading-relaxed">{KEY.intro}</p>
          </header>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={100}>
          <nav aria-labelledby="at-a-glance" className={`${card} mb-12`}>
            <h2 id="at-a-glance" className="text-xl md:text-2xl font-bold mb-4">
              The 7 stages at a glance
            </h2>
            <ol className="space-y-3">
              {KEY.stages.map((stage) => (
                <li key={stage.number}>
                  <a href={`#stage-${stage.number}`} className="group flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {stage.number}
                    </span>
                    <span className="pt-0.5 group-hover:underline underline-offset-4">{stage.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </AnimatedSection>

        <div className="space-y-8 mb-16">
          {KEY.stages.map((stage) => (
            <AnimatedSection key={stage.number} animation="slide-up">
              <section id={`stage-${stage.number}`} className={`${card} scroll-mt-28`}>
                <div className="flex items-start gap-4 mb-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {stage.number}
                  </span>
                  <div>
                    <p className={`${eyebrow} mb-1`}>Stage {stage.number}</p>
                    <h2 className="text-2xl font-bold">{stage.name}</h2>
                  </div>
                </div>

                <p className="mb-6">
                  <span className="font-semibold">Goal:</span> {stage.goal}
                </p>

                <p className={`${eyebrow} mb-3`}>Ask yourself</p>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  {stage.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>

                <div className="rounded-lg bg-muted p-4 md:p-5 mb-6">
                  <p className={`${eyebrow} mb-2`}>In this case</p>
                  <p>{stage.inThisCase}</p>
                </div>

                <p className="border-l-4 border-primary pl-4">
                  <span className="font-semibold">Watch out:</span> {stage.watchOut}
                </p>
              </section>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="slide-up">
          <section aria-labelledby="other-problems" className="mb-16">
            <h2 id="other-problems" className="text-2xl md:text-3xl font-bold mb-6">
              Other real problems in the data
            </h2>
            <div className="space-y-6">
              {KEY.otherRealProblems.map((item) => (
                <div key={item.name} className={card}>
                  <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="slide-up">
          <section aria-labelledby="pitfalls" className="mb-16">
            <h2 id="pitfalls" className="text-2xl md:text-3xl font-bold mb-6">
              Common pitfalls
            </h2>
            <ul className={`${card} divide-y divide-border py-2 md:py-2`}>
              {KEY.pitfalls.map((item) => (
                <li key={item.name} className="py-5">
                  <p className="font-bold mb-1">{item.name}</p>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="slide-up">
          <section aria-labelledby="frameworks" className="mb-16">
            <h2 id="frameworks" className="text-2xl md:text-3xl font-bold mb-6">
              Frameworks worth knowing
            </h2>
            <ul className="space-y-4">
              {KEY.frameworks.map((fw) => (
                <li key={fw.name} className="rounded-xl border border-border bg-card text-card-foreground p-5 md:p-6">
                  <h3 className="text-lg font-bold mb-2">{fw.name}</h3>
                  <p className="mb-3">{fw.oneLine}</p>
                  <a
                    href={fw.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textLink} inline-flex items-center gap-1 text-base`}
                  >
                    {hostname(fw.url)}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="slide-up">
          <section aria-labelledby="sources" className="mb-16">
            <h2 id="sources" className="text-2xl md:text-3xl font-bold mb-6">
              Sources
            </h2>
            <ul className="space-y-3">
              {KEY.sources.map((src) => (
                <li key={src.url} className="break-words">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className={textLink}>
                    {src.title}
                  </a>
                  <span className="block text-sm text-muted-foreground mt-0.5">{src.publisher}</span>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection animation="fade-in">
          <div className={`${card} text-center`}>
            <h2 className="text-2xl font-bold mb-3">Keep practicing with PMA</h2>
            <p className="mb-6">
              Cases like this one are how PMs get better. Join PMA and keep showing up to practice with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary !text-white hover:opacity-90 drop-shadow-md"
              >
                <a href={JOIN_PMA_URL} target="_blank" rel="noopener noreferrer">
                  Join PMA
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={SLACK_URL} target="_blank" rel="noopener noreferrer">
                  Join our Slack
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
            <Link
              to="/events/case-interview"
              className="mt-6 inline-flex items-center gap-1 text-base font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to the case page
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </div>
);

export default CaseAnswerKeyPage;

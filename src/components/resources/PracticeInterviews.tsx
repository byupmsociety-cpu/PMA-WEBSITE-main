import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VIDEO_LIBRARY, type InterviewGuide, type LibraryVideo } from "@/lib/videoLibrary";

// Course videos are unlisted; hidden until we decide to share them with members.
const TOPICS = VIDEO_LIBRARY.map((topic) => ({
  ...topic,
  videos: topic.videos
    .filter((video) => !video.fromCourse)
    .sort((a, b) => Number(Boolean(b.startHere)) - Number(Boolean(a.startHere))),
})).filter((topic) => topic.videos.length > 0);

const DEFAULT_TOPIC = TOPICS.find((topic) => topic.slug === "product-sense")?.slug ?? TOPICS[0]?.slug ?? "";

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</h4>
);

const VideoTile = ({ video }: { video: LibraryVideo }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${video.title}, ${video.minutes} min${video.startHere ? ", start here" : ""} (opens YouTube in a new tab)`}
    className={`group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
      video.startHere ? "border-primary/40" : "border-border"
    }`}
  >
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      <img
        src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {video.startHere && (
        <Badge className="absolute left-2 top-2 px-2 py-0.5 text-[11px] font-semibold">Start here</Badge>
      )}
      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
        {video.minutes} min
      </span>
    </div>
    <div className="flex flex-1 flex-col p-3">
      <h5 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
        {video.title}
      </h5>
    </div>
  </a>
);

const GuideList = ({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <div className="min-w-0">
      <SubHeading>{title}</SubHeading>
      <ListTag className="space-y-2">
        {items.map((item, idx) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
            {ordered ? (
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

const Guide = ({ guide }: { guide: InterviewGuide }) => (
  <div className="mt-6 space-y-6">
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-md border border-border p-4">
        <SubHeading>What it tests</SubHeading>
        <p className="text-sm leading-relaxed text-foreground/90">{guide.tests}</p>
      </div>
      <div className="rounded-md border border-border p-4">
        <SubHeading>Where you'll see it</SubHeading>
        <p className="text-sm leading-relaxed text-foreground/90">{guide.where}</p>
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-3">
      <GuideList title="How to approach it" items={guide.approach} ordered />
      <GuideList title="What works" items={guide.works} />
      <GuideList title="What hurts" items={guide.hurts} />
    </div>
  </div>
);

const PracticeInterviews = () => {
  const [selected, setSelected] = useState(DEFAULT_TOPIC);

  if (TOPICS.length === 0) return null;

  return (
    <section
      id="practice-interviews"
      aria-labelledby="practice-interviews-title"
      className="max-w-6xl mx-auto mb-12 scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <AnimatedSection animation="fade-in" className="p-5 md:p-8">
          <h2 id="practice-interviews-title" className="text-2xl md:text-3xl font-extrabold text-card-foreground">
            Practice Interviews
          </h2>
          <p className="mt-1 text-sm md:text-base text-muted-foreground">
            Learn how each PM interview round works, then watch real mock interviews before you practice your own. Videos are from Aced (formerly Exponent).
          </p>
        </AnimatedSection>

        <div className="border-t border-border p-5 md:p-8">
          <Tabs value={selected} onValueChange={setSelected}>
            <TabsList
              aria-label="Interview types"
              className="h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1"
            >
              {TOPICS.map((topic) => (
                <TabsTrigger key={topic.slug} value={topic.slug} className="gap-1.5 text-xs sm:text-sm">
                  {topic.title}
                  <span className="text-muted-foreground">{topic.videos.length}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {TOPICS.map((topic) => (
              <TabsContent key={topic.slug} value={topic.slug} className="mt-6 rounded-lg border border-border p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-card-foreground">{topic.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-foreground/90">{topic.description}</p>

                {topic.guide && <Guide guide={topic.guide} />}

                <div className="mt-8">
                  <SubHeading>
                    {topic.videos.length} video{topic.videos.length !== 1 ? "s" : ""}
                  </SubHeading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {topic.videos.map((video) => (
                      <VideoTile key={video.youtubeId} video={video} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PracticeInterviews;

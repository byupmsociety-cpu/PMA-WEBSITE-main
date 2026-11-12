import { useEffect, useState } from "react";
import { Check, Lock, Play } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PREP_JOURNEY } from "@/lib/prepJourney";
import { VIDEO_LIBRARY, type InterviewGuide, type LibraryVideo } from "@/lib/videoLibrary";

// Course videos are unlisted; hidden until we decide to share them with members.
const TOPICS = VIDEO_LIBRARY.map((topic) => ({
  ...topic,
  videos: topic.videos
    .filter((video) => !video.fromCourse)
    .sort((a, b) => Number(Boolean(b.startHere)) - Number(Boolean(a.startHere))),
})).filter((topic) => topic.videos.length > 0);

const VIDEO_BY_ID = new Map<string, LibraryVideo>(
  VIDEO_LIBRARY.flatMap((topic) => topic.videos.filter((v) => !v.fromCourse).map((v) => [v.youtubeId, v] as const)),
);

const PICKS = Object.fromEntries(
  PREP_JOURNEY.roundPicks.map((pick) => [
    pick.topic,
    pick.videos.filter((v) => VIDEO_BY_ID.has(v.youtubeId)),
  ]),
);

const DEFAULT_TOPIC = TOPICS.find((topic) => topic.slug === "product-sense")?.slug ?? TOPICS[0]?.slug ?? "";

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</h4>
);

interface VideoTileProps {
  video: LibraryVideo;
  role?: string;
  note?: string;
  watched?: boolean;
  locked?: boolean;
  onLocked?: () => void;
  onToggleWatched?: (id: string) => void;
}

const VideoTile = ({ video, role, note, watched, locked, onLocked, onToggleWatched }: VideoTileProps) => {
  const thumb = (
    <div className="relative aspect-video w-full overflow-hidden bg-primary">
      {!locked && (
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover ${watched ? "opacity-60" : ""}`}
        />
      )}
      {locked && (
        <span className="absolute inset-0 flex items-center justify-center text-primary-foreground">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      {!locked && video.startHere && !role && (
        <Badge className="absolute left-2 top-2 px-2 py-0.5 text-[11px] font-semibold">Start here</Badge>
      )}
      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
        {video.minutes} min
      </span>
    </div>
  );

  const body = (
    <div className="flex flex-col gap-1 p-3 pb-2">
      {role && <span className="text-xs font-semibold text-accent">{role}</span>}
      <h5 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
        {video.title}
      </h5>
      {note && <p className="text-sm leading-snug text-muted-foreground">{note}</p>}
    </div>
  );

  const linkClass =
    "group block rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg ${
        video.startHere || role ? "border-primary/40" : "border-border"
      }`}
    >
      {locked ? (
        <button type="button" onClick={onLocked} className={`${linkClass} text-left`} aria-label={`${video.title}, members only`}>
          {thumb}
          {body}
        </button>
      ) : (
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${video.title}, ${video.minutes} min${video.startHere ? ", start here" : ""} (opens YouTube in a new tab)`}
          className={linkClass}
        >
          {thumb}
          {body}
        </a>
      )}
      <div className="mt-auto px-3 pb-3">
        {locked ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Opens when you are a member
          </span>
        ) : (
          onToggleWatched && (
            <button
              type="button"
              onClick={() => onToggleWatched(video.youtubeId)}
              aria-pressed={!!watched}
              className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              {watched ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3 w-3" aria-hidden="true" />}
              {watched ? "Watched" : "Mark watched"}
            </button>
          )
        )}
      </div>
    </div>
  );
};

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

export const Guide = ({ guide }: { guide: InterviewGuide }) => (
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

interface PracticeInterviewsProps {
  initialTopic?: string;
  watched?: Set<string>;
  onToggleWatched?: (id: string) => void;
  locked?: boolean;
  onLocked?: () => void;
}

const PracticeInterviews = ({ initialTopic, watched, onToggleWatched, locked, onLocked }: PracticeInterviewsProps) => {
  const validInitial = TOPICS.some((t) => t.slug === initialTopic) ? (initialTopic as string) : DEFAULT_TOPIC;
  const [selected, setSelected] = useState(validInitial);

  useEffect(() => {
    setSelected(validInitial);
  }, [validInitial]);

  if (TOPICS.length === 0) return null;

  const tile = (video: LibraryVideo, extra?: { role?: string; note?: string }) => (
    <VideoTile
      key={video.youtubeId}
      video={video}
      role={extra?.role}
      note={extra?.note}
      watched={watched?.has(video.youtubeId)}
      locked={locked}
      onLocked={onLocked}
      onToggleWatched={onToggleWatched}
    />
  );

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

            {TOPICS.map((topic) => {
              const picks = PICKS[topic.slug] ?? [];
              const pickIds = new Set(picks.map((p) => p.youtubeId));
              const rest = topic.videos.filter((v) => !pickIds.has(v.youtubeId));
              return (
                <TabsContent key={topic.slug} value={topic.slug} className="mt-6 rounded-lg border border-border p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-card-foreground">{topic.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-foreground/90">{topic.description}</p>

                  {topic.guide &&
                    (locked ? (
                      <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        The round guide opens for members.
                      </p>
                    ) : (
                      <Guide guide={topic.guide} />
                    ))}

                  {picks.length > 0 && (
                    <div className="mt-8">
                      <SubHeading>{picks.length === 1 ? "Start with this one" : `Start with these ${picks.length === 3 ? "three" : picks.length}`}</SubHeading>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {picks.map((pick) => {
                          const video = VIDEO_BY_ID.get(pick.youtubeId);
                          return video ? tile(video, { role: pick.role, note: pick.note }) : null;
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <SubHeading>
                      {picks.length > 0 ? "Everything else" : "All videos"} · {rest.length} video{rest.length !== 1 ? "s" : ""}
                    </SubHeading>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {rest.map((video) => tile(video))}
                    </div>
                    {onToggleWatched && !locked && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Your watched marks save on this device and show up everywhere a video appears.
                      </p>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default PracticeInterviews;

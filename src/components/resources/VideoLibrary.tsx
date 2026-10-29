import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VIDEO_LIBRARY, type InterviewGuide, type LibraryVideo, type VideoTopic } from "@/lib/videoLibrary";

const ALL = "all";

// Course videos are unlisted; hidden until we decide to share them with members.
const TOPICS = VIDEO_LIBRARY.map((topic) => ({
  ...topic,
  videos: topic.videos.filter((video) => !video.fromCourse),
})).filter((topic) => topic.videos.length > 0);

const TOTAL_VIDEOS = TOPICS.reduce((sum, topic) => sum + topic.videos.length, 0);

const VideoTile = ({ video }: { video: LibraryVideo }) => (
  <a
    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${video.title}, ${video.minutes} min${video.fromCourse ? ", Aced course" : ""} (opens YouTube in a new tab)`}
    className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      <img
        src={`https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`}
        alt={video.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
        {video.minutes} min
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-2 p-3">
      <h5 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
        {video.title}
      </h5>
      {video.fromCourse && (
        <Badge variant="outline" className="mt-auto w-fit px-2 py-0 text-[11px] font-medium text-muted-foreground">
          Aced course
        </Badge>
      )}
    </div>
  </a>
);

const GuideList = ({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) => {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <div>
      <h5 className="mb-2 text-sm font-semibold text-foreground">{title}</h5>
      <ListTag className={`${ordered ? "list-decimal" : "list-disc"} space-y-1.5 pl-5`}>
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-foreground/90">
            {item}
          </li>
        ))}
      </ListTag>
    </div>
  );
};

const GuidePanel = ({ guide, open }: { guide: InterviewGuide; open: boolean }) => (
  <details open={open} className="group/guide mb-6 rounded-lg border border-border bg-card">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
      How this interview works
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/guide:rotate-180" />
    </summary>
    <div className="space-y-5 border-t border-border p-4 md:p-5">
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">What it tests: </span>
          {guide.tests}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Where you'll see it: </span>
          {guide.where}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <GuideList title="How to approach it" items={guide.approach} ordered />
        <GuideList title="What works" items={guide.works} />
        <GuideList title="What hurts" items={guide.hurts} />
      </div>
    </div>
  </details>
);

const TopicSection = ({ topic, guideOpen }: { topic: VideoTopic; guideOpen: boolean }) => (
  <section aria-labelledby={`video-topic-${topic.slug}`}>
    <div className="mb-4">
      <h4 id={`video-topic-${topic.slug}`} className="text-lg font-bold text-foreground">
        {topic.title}
      </h4>
      <p className="text-sm text-muted-foreground">{topic.description}</p>
    </div>
    {topic.guide && <GuidePanel key={String(guideOpen)} guide={topic.guide} open={guideOpen} />}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {topic.videos.map((video) => (
        <VideoTile key={video.youtubeId} video={video} />
      ))}
    </div>
  </section>
);

const chipClass = (selected: boolean) =>
  `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
    selected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
  }`;

const VideoLibrary = () => {
  const [selected, setSelected] = useState<string>(ALL);

  const chips = [
    { slug: ALL, title: "All", count: TOTAL_VIDEOS },
    ...TOPICS.map((topic) => ({ slug: topic.slug, title: topic.title, count: topic.videos.length })),
  ];

  const visibleTopics = selected === ALL ? TOPICS : TOPICS.filter((topic) => topic.slug === selected);

  return (
    <section aria-labelledby="video-library-title">
      <div className="mb-6">
        <h3 id="video-library-title" className="text-2xl font-bold text-foreground">
          Video Library
        </h3>
        <p className="mt-1 text-base text-muted-foreground">
          {TOTAL_VIDEOS} PM interview videos from Aced (formerly Exponent), grouped by interview type
        </p>
      </div>

      <div role="group" aria-label="Filter videos by interview type" className="mb-8 flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isSelected = selected === chip.slug;
          return (
            <button
              key={chip.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(chip.slug)}
              className={chipClass(isSelected)}
            >
              {chip.title}
              <span className={isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}>{chip.count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-12">
        {visibleTopics.map((topic) => (
          <TopicSection key={topic.slug} topic={topic} guideOpen={selected !== ALL} />
        ))}
      </div>
    </section>
  );
};

export default VideoLibrary;

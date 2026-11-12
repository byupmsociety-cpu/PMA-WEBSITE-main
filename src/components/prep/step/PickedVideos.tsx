import { PICKS_BY_TOPIC, STEP_BY_ID, VIDEO_BY_ID, VISIBLE_TOPICS } from "@/lib/prepPlan";
import PickVideoCard from "./PickVideoCard";

const countWord = (n: number) => (n === 3 ? "three" : n === 2 ? "two" : String(n));

const PickedVideos = ({ stepId, locked }: { stepId: string; locked: boolean }) => {
  const step = STEP_BY_ID[stepId];

  if (step.roundPicks) {
    const multiple = step.roundPicks.length > 1;
    return (
      <>
        {step.roundPicks.map((topic) => {
          const pick = PICKS_BY_TOPIC[topic];
          if (!pick) return null;
          const videos = pick.videos.filter((v) => VIDEO_BY_ID.has(v.youtubeId));
          const total = VISIBLE_TOPICS.find((t) => t.slug === topic)?.videos.length ?? videos.length;
          const heading =
            videos.length === 1
              ? `${multiple ? `${pick.label}: ` : ""}Watch this one`
              : multiple
                ? `${pick.label}: watch these ${countWord(videos.length)}`
                : `Watch these ${countWord(videos.length)}, in order`;
          return (
            <section key={topic} className="mt-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[21px] font-bold">{heading}</h2>
                <span className="text-sm text-muted-foreground">Picked from {total} videos on this round</span>
              </div>
              <div className="mt-3 grid gap-3">
                {videos.map((v) => (
                  <PickVideoCard key={v.youtubeId} youtubeId={v.youtubeId} role={v.role} note={v.note} locked={locked} />
                ))}
              </div>
            </section>
          );
        })}
      </>
    );
  }

  const videoLinks = step.links.flatMap((l) => (l.kind === "video" && VIDEO_BY_ID.has(l.youtubeId) ? [l.youtubeId] : []));
  if (videoLinks.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-[21px] font-bold">Watch</h2>
      <div className="mt-3 grid gap-3">
        {videoLinks.map((id) => (
          <PickVideoCard key={id} youtubeId={id} locked={locked} />
        ))}
      </div>
    </section>
  );
};

export default PickedVideos;

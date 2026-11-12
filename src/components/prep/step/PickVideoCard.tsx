import { Check, ExternalLink, Lock, Play } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import { VIDEO_BY_ID } from "@/lib/prepPlan";
import { cn } from "@/lib/utils";
import { Chip, focusRing, linkClass } from "../shared";

interface PickVideoCardProps {
  youtubeId: string;
  role?: string | null;
  note?: string | null;
  locked: boolean;
}

const PickVideoCard = ({ youtubeId, role, note, locked }: PickVideoCardProps) => {
  const { watched, toggleWatched, goJoin } = usePrep();
  const video = VIDEO_BY_ID.get(youtubeId);
  if (!video) return null;
  const seen = watched.has(youtubeId);
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;

  const thumb = (
    <span className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-lg bg-primary sm:w-44">
      {!locked && (
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <span className="absolute inset-0 grid place-content-center">
        <span className="grid h-10 w-10 place-content-center rounded-full bg-card/90 text-card-foreground">
          {locked ? <Lock className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4 fill-current" aria-hidden="true" />}
        </span>
      </span>
      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
        {video.minutes} min
      </span>
    </span>
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row",
        seen ? "bg-muted/60" : "bg-card text-card-foreground",
      )}
    >
      {locked ? (
        <button type="button" onClick={goJoin} className={cn("text-left", focusRing)} aria-label={`${video.title}, members only`}>
          {thumb}
        </button>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className={focusRing} aria-label={`Watch ${video.title} on YouTube`}>
          {thumb}
        </a>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {role && <Chip tone={role === "Watch first" ? "primary" : "muted"}>{role}</Chip>}
          {seen && (
            <Chip className="text-muted-foreground">
              <Check className="h-3 w-3" aria-hidden="true" /> Watched
            </Chip>
          )}
        </div>
        <div className={cn("mt-1.5 text-base font-semibold leading-snug", seen && "text-muted-foreground")}>{video.title}</div>
        {note && <p className="mt-0.5 text-sm text-foreground/75">{note}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {locked ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Opens when you are a member
            </span>
          ) : (
            <>
              <a href={url} target="_blank" rel="noopener noreferrer" className={cn(linkClass, "inline-flex min-h-8 items-center gap-1", focusRing)}>
                Watch on YouTube <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <button
                type="button"
                aria-pressed={seen}
                onClick={() => toggleWatched(youtubeId)}
                className={cn("min-h-8 font-semibold text-muted-foreground hover:text-foreground", focusRing)}
              >
                {seen ? "Mark unwatched" : "Mark watched"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickVideoCard;

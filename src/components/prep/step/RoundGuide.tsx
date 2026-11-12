import { useState } from "react";
import { ChevronDown, ChevronRight, Lock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Guide } from "@/components/resources/PracticeInterviews";
import type { VideoTopic } from "@/lib/videoLibrary";
import { cn } from "@/lib/utils";
import { cardClass, focusRing } from "../shared";

const RoundGuide = ({ topic, locked }: { topic: VideoTopic; locked: boolean }) => {
  const [open, setOpen] = useState(false);
  if (!topic.guide) return null;
  return (
    <Collapsible open={open} onOpenChange={setOpen} className={cn(cardClass, "mt-8")}>
      <CollapsibleTrigger className={cn("flex w-full items-center justify-between gap-3 rounded-xl px-5 py-4 text-left", focusRing)}>
        <span>
          <span className="block font-heading text-[19px] font-bold">How the {topic.title.toLowerCase()} round works</span>
          <span className="text-sm text-muted-foreground">
            What it tests, where you will see it, how to approach it. 3 minute read.
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-5 pb-5">
        {locked ? (
          <p className="inline-flex items-center gap-2 text-[15px] text-muted-foreground">
            <Lock className="h-4 w-4" aria-hidden="true" /> The round guide opens for members.
          </p>
        ) : (
          <div className="-mt-4">
            <Guide guide={topic.guide} />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RoundGuide;

import { Search, User } from "lucide-react";
import { usePrep } from "@/hooks/usePrepState";
import { cn } from "@/lib/utils";
import { SEARCH_PLACEHOLDER } from "./copy";
import { focusRing } from "./shared";

const PrepBottomBar = () => {
  const { focusSearch, openAsk } = usePrep();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-card px-3 py-2.5 lg:hidden">
      <button
        type="button"
        onClick={focusSearch}
        className={cn(
          "flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-[15px] text-muted-foreground",
          focusRing,
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{SEARCH_PLACEHOLDER}</span>
      </button>
      <button
        type="button"
        onClick={() => openAsk({ kind: "coffee-chat" })}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-[15px] font-semibold text-primary-foreground",
          focusRing,
        )}
      >
        <User className="h-4 w-4" aria-hidden="true" /> Officer
      </button>
    </div>
  );
};

export default PrepBottomBar;

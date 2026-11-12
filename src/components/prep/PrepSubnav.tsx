import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePrep, type PrepTab } from "@/hooks/usePrepState";
import { cn } from "@/lib/utils";
import { SEARCH_PLACEHOLDER } from "./copy";
import { focusRing } from "./shared";

const TABS: [PrepTab, string][] = [
  ["plan", "My plan"],
  ["library", "Library"],
  ["people", "People"],
];

const PrepSubnav = () => {
  const { tab, view, goTab, goLibrary } = usePrep();
  const [value, setValue] = useState("");

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4">
        <nav aria-label="Prep sections" className="flex gap-5 text-[15px]">
          {TABS.map(([id, label]) => {
            const on = tab === id;
            return (
              <button
                key={id}
                type="button"
                aria-current={on && view === id ? "page" : undefined}
                onClick={() => goTab(id)}
                className={cn(
                  "-mb-px min-h-11 border-b-2 py-3",
                  on ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  focusRing,
                )}
              >
                {label}
              </button>
            );
          })}
        </nav>
        {view !== "library" && (
          <form
            role="search"
            className="relative ml-auto hidden w-72 md:block"
            onSubmit={(e) => {
              e.preventDefault();
              goLibrary({ q: value.trim() || undefined });
              setValue("");
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER}
              aria-label="Search prep"
              className="h-9 bg-background pl-9 text-sm"
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default PrepSubnav;

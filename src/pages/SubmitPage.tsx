import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCaseEntry, type CaseSubmission, type CaseTrack } from "@/lib/caseSubmissions";

const TRACKS: { value: CaseTrack; label: string }[] = [
  { value: "chat", label: "Spec with chat AI" },
  { value: "prototype", label: "Prototype or artifact" },
  { value: "pull_request", label: "Pull request" },
];

const EMPTY: CaseSubmission = { teamName: "", members: "", problem: "", workUrl: "", track: "chat", notes: "" };

const SubmitPage = () => {
  const [form, setForm] = useState<CaseSubmission>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (field: keyof CaseSubmission) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitCaseEntry(form);
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Submit your case work</h1>
          <p className="mt-3 text-muted-foreground">
            AI PM Case Competition. One submission per team. Officers look through every entry, and the best changes get merged into this site.
          </p>

          {status === "sent" ? (
            <div role="status" className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-xl font-bold text-card-foreground">Submitted. Nice work.</h2>
              <p className="mt-2 text-muted-foreground">
                If your change gets merged into the live PMA site, your names go on it. Add this project to your resume either way.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setForm(EMPTY);
                  setStatus("idle");
                }}
              >
                Submit another team
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team name</Label>
                <Input id="team-name" required maxLength={100} value={form.teamName} onChange={update("teamName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="members">Team members</Label>
                <Input
                  id="members"
                  required
                  maxLength={500}
                  placeholder="Full names, separated by commas"
                  value={form.members}
                  onChange={update("members")}
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Track</legend>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((t) => {
                    const selected = form.track === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setForm((f) => ({ ...f, track: t.value }))}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="problem">The problem you picked and your evidence</Label>
                <Textarea
                  id="problem"
                  required
                  maxLength={2000}
                  rows={4}
                  placeholder="One or two sentences on the problem, plus the key number and quote behind it."
                  value={form.problem}
                  onChange={update("problem")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="work-url">Link to your work</Label>
                <Input
                  id="work-url"
                  required
                  maxLength={500}
                  inputMode="url"
                  placeholder="Shared chat, doc, artifact, prototype, or PR"
                  value={form.workUrl}
                  onChange={update("workUrl")}
                />
                <p className="text-xs text-muted-foreground">Make sure the link is viewable by anyone who has it.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  Spec and success metric, or a second link <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea id="notes" maxLength={2000} rows={3} value={form.notes} onChange={update("notes")} />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Submitting..." : "Submit"}
                </Button>
                {status === "error" && (
                  <p role="alert" className="text-sm text-destructive">
                    Something went wrong. Check your link and try again.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;

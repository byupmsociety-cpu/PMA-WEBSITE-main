import type { SessionKind } from "@/lib/prepJourney";

export interface DraftInput {
  kind: SessionKind;
  to: string;
  stepId: string | null;
  stepTitle: string | null;
  roundLabel: string;
  company: string;
  focus: string;
  isMember: boolean;
}

/** Drafts are in the student's voice and end with [Your name]. */
export const draftEmail = (c: DraftInput): { subject: string; body: string } => {
  const hi = `Hi ${c.to.split(" ")[0]},`;
  const sign = (closing: string) => `${closing},\n[Your name]`;
  const who = c.isMember ? "a PMA member" : "a BYU student interested in PM";
  const round = c.roundLabel.toLowerCase();

  if (c.kind === "mock-interview") {
    if (c.stepId === "offer-pay-forward") {
      return {
        subject: "I'd like to run mock interviews for PMA",
        body: `${hi}\n\nI just finished recruiting and want to help the next group. I'm open to running a mock interview a month for younger PMA members${c.focus ? `, especially on ${c.focus}` : ""}.\n\n${sign("Thanks")}`,
      };
    }
    const final = c.stepId === "offer-final-rounds";
    return {
      subject: final ? "PMA final round mock request" : `PMA mock interview request: ${round} round`,
      body: `${hi}\n\nI'm a PMA member${c.stepTitle ? ` working on "${c.stepTitle}" in my prep plan` : ""}. Could you run a 30 minute mock interview with me on a ${round} question?${final ? " It's for a final round." : ""}\n\nMy interview: ${c.company || "not scheduled yet"}\nWhat I want feedback on: ${c.focus || "anything you notice"}\n\nI've watched the picked videos for this round and answered a few questions out loud. Any time that works for you works for me.\n\n${sign("Thanks")}`,
    };
  }

  if (c.kind === "resume-review") {
    const second = c.stepId === "apply-no-interviews";
    return {
      subject: second ? "PMA second resume review request" : "PMA resume review request",
      body: `${hi}\n\n${
        second
          ? "I'm a PMA member and my applications have gone quiet, so I think my resume is the problem. Could you look it over? It's attached as a PDF."
          : "I'm a PMA member and just rewrote my resume for PM roles. Could you look it over? It's attached as a PDF."
      }\n\nMy one question: ${c.focus || "do my bullets show ownership and a number?"}\nWhere I'm applying: ${c.company || "APM programs this fall"}\n\n${sign("Thank you")}`,
    };
  }

  if (c.stepId === "net-touch-one") {
    return {
      subject: "Could you look at my first LinkedIn note?",
      body: `${hi}\n\nI'm ${who} and I'm about to start reaching out to alumni on LinkedIn. Could you read my first note before I send it and tell me if you would reply?\n\n[Paste your note here]\n\n${c.focus ? `Something I'm unsure about: ${c.focus}\n\n` : ""}${sign("Thank you")}`,
    };
  }
  if (c.stepId === "offer-decide") {
    return {
      subject: "Could I talk through an offer with you?",
      body: `${hi}\n\nI'm ${who} and I just got an internship offer. Would you have 20 minutes this week to help me think it through before I sign?\n\n${c.focus ? `What I'm weighing: ${c.focus}\n\n` : ""}${sign("Thank you")}`,
    };
  }
  return {
    subject: "PMA coffee chat",
    body: `${hi}\n\nI'm ${who} and I'm just getting started. Would you have 20 minutes in the next couple of weeks to talk about how you found PM and what you wish you had done earlier?\n\n${c.focus ? `Something I'm thinking about: ${c.focus}\n\n` : ""}${sign("Thank you")}`,
  };
};

export const mailtoHref = (email: string, subject: string, body: string) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

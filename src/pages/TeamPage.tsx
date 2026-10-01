import React, { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { ChevronDown, Linkedin, Lock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FACULTY, FORMER_OFFICERS, PRESIDENCY, type Officer } from "@/lib/officers";

const PRESIDENTS = PRESIDENCY.filter((o) => o.position.includes("President"));
const VICE_PRESIDENTS = PRESIDENCY.filter((o) => !o.position.includes("President"));

const TEAM_GROUPS: { title: string; members: Officer[] }[] = [
  { title: "Presidents", members: PRESIDENTS },
  { title: "Vice Presidents", members: VICE_PRESIDENTS },
  { title: "Faculty Advisor", members: FACULTY },
];

const AMBASSADOR_FORM_URL =
  "https://forms.office.com/pages/responsepage.aspx?id=m278xvtRqEi3eZ7lZLQEE8C_ph6CqvNEvrlyhQcKDr1UQjFQUFdNNVRIQzZBTjZGWVpSUTZPN01FTS4u&route=shorturl";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const MemberCard: React.FC<{ member: Officer }> = ({ member }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = member.imageUrl && !imageFailed;

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-square w-full bg-muted">
        {showImage ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover object-center"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-primary font-heading text-3xl font-bold text-primary-foreground"
            aria-hidden="true"
          >
            {initials(member.name)}
          </div>
        )}
      </div>
      <div className="flex flex-1 items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-card-foreground">{member.name}</h3>
          <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{member.position}</p>
        </div>
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>
    </li>
  );
};

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <h1 className="mb-8 text-3xl md:text-4xl">Our Team</h1>
        </AnimatedSection>

        {TEAM_GROUPS.map((group) => (
          <section key={group.title} className="mb-10">
            <h2 className="mb-4 text-xl md:text-2xl">{group.title}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </ul>
          </section>
        ))}

        <section className="mb-10 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl md:text-2xl">Contact Them</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Available for paid members
            </span>
          </div>
        </section>

        <Collapsible className="mb-10 rounded-lg border border-border bg-card">
          <CollapsibleTrigger className="group flex w-full items-center justify-between p-4 text-left">
            <span className="font-heading text-lg font-semibold">Former Officers</span>
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="divide-y divide-border border-t border-border">
              {FORMER_OFFICERS.map((officer) => (
                <li key={officer.name} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium">{officer.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{officer.position}</p>
                  </div>
                  {officer.linkedinUrl && (
                    <a
                      href={officer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${officer.name} on LinkedIn`}
                      className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>

        <div className="text-center">
          <a
            href={AMBASSADOR_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Apply to be an Ambassador today!
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

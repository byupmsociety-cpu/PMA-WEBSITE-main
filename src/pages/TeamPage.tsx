import React, { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { Copy, ChevronLeft } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
  order?: number;
}

const TeamPage: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = async (e: React.MouseEvent, memberId: string, email: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(memberId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from("team_members")
          .select("id, name, position, bio, image_url, email, linkedin_url, priority")
          .order("priority", { ascending: true })
          .order("name", { ascending: true });

        if (supabaseError) {
          throw supabaseError;
        }

        const transformedTeam: TeamMember[] =
          data?.map((member) => ({
            id: member.id,
            name: member.name ?? "",
            role: member.position ?? "",
            bio: member.bio ?? "",
            image: member.image_url ?? "/img/placeholder.svg",
            email: member.email ?? undefined,
            linkedin: member.linkedin_url ?? undefined,
            order: member.priority ?? undefined,
          })) ?? [];

        setTeam(transformedTeam);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const toggleCard = (index: number) => {
    setFlippedCards((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our <span className="text-gradient">Team</span>
              </h1>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-[520px] animate-pulse"
              >
                <div className="h-60 bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our <span className="text-gradient">Team</span>
              </h1>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-red-300">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h1>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={member.id}>
              <div className="relative h-[520px] cursor-pointer perspective-1000" onClick={() => toggleCard(index)}>
                <div
                  className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
                    flippedCards.includes(index) ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col">
                      <div className="h-60 relative">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = "/img/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto">
                        <h3 className="text-lg font-bold">{member.name}</h3>
                        <p className="text-gradient-accessible text-sm font-medium mb-2">{member.role}</p>
                        <div className="text-on-dark text-sm whitespace-pre-line">{member.bio}</div>
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <div
                      className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-full p-4 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">{member.name}</h3>
                        <button
                          type="button"
                          onClick={() => toggleCard(index)}
                          className="flex items-center gap-1 text-on-dark-muted hover:text-on-dark text-sm transition-colors"
                          aria-label="Flip card back"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back
                        </button>
                      </div>
                      <p className="text-on-dark-muted text-xs mb-3">Contact</p>
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {member.email && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <svg
                              className="w-5 h-5 text-on-dark-muted shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <a 
                              href={`mailto:${member.email}`} 
                              className="text-sm text-on-dark hover:text-white flex-1 min-w-0 truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {member.email}
                            </a>
                            <button
                              type="button"
                              onClick={(e) => handleCopyEmail(e, member.id, member.email!)}
                              className="p-1.5 rounded-md text-on-dark-muted hover:text-on-dark hover:bg-white/10 transition-colors shrink-0"
                              title="Copy email"
                              aria-label="Copy email"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {copiedId === member.id && (
                              <span className="text-xs text-green-400 shrink-0">Copied!</span>
                            )}
                          </div>
                        )}
                        {member.linkedin && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-on-dark-muted shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            <a
                              href={
                                member.linkedin?.startsWith("http")
                                  ? member.linkedin
                                  : `https://${member.linkedin}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-on-dark hover:text-white break-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                        {!member.email && !member.linkedin && (
                          <p className="text-on-dark-muted text-sm">No contact info available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-on-dark mb-6"></p>
          <a
            href="https://forms.office.com/pages/responsepage.aspx?id=m278xvtRqEi3eZ7lZLQEE8C_ph6CqvNEvrlyhQcKDr1UQjFQUFdNNVRIQzZBTjZGWVpSUTZPN01FTS4u&route=shorturl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Apply to be an Ambassador today!
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

import { CalendarDays, Linkedin, Mail, Phone, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PRESIDENCY } from "@/lib/officers";

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const PresidencyConnect = () => {
  return (
    <AnimatedSection animation="fade-in">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-bold">Connect with a Presidency Member</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESIDENCY.map((member) => (
            <Card key={member.name} className="h-full border-border">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    {member.imageUrl && (
                      <AvatarImage src={member.imageUrl} alt={member.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-card-foreground break-words">{member.name}</h3>
                    {member.position && (
                      <p className="text-sm text-muted-foreground break-words">{member.position}</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {member.bookingUrl && (
                    <Button asChild className="flex-1 min-w-[10rem]">
                      <a href={member.bookingUrl} target="_blank" rel="noopener noreferrer">
                        <CalendarDays className="w-4 h-4" />
                        Book a time
                      </a>
                    </Button>
                  )}
                  {member.email && (
                    <Button asChild variant="outline" size="icon">
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} title={member.email}>
                        <Mail className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {member.phone && (
                    <Button asChild variant="outline" size="icon">
                      <a href={`tel:${member.phone}`} aria-label={`Call ${member.name}`} title={member.phone}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {member.linkedinUrl && (
                    <Button asChild variant="outline" size="icon">
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PresidencyConnect;

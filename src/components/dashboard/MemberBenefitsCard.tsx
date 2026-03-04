import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Briefcase, MapPin, Users, BookOpen, ArrowRight } from "lucide-react";

const BENEFITS = [
  {
    icon: Briefcase,
    title: "Job Board Access",
    description: "Curated PM opportunities with personalized alerts",
  },
  {
    icon: MapPin,
    title: "Personalized Roadmap",
    description: "Custom career path based on your goals",
  },
  {
    icon: Users,
    title: "Member Directory",
    description: "Connect with fellow PM aspirants",
  },
  {
    icon: BookOpen,
    title: "Premium Resources",
    description: "Exclusive guides and interview prep",
  },
];

export function MemberBenefitsCard() {
  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-500" />
          PMA Member Benefits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <div className="p-1.5 rounded-md bg-amber-500/10">
                <benefit.icon className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          onClick={() => window.open("https://clubs.byu.edu/link/club/18295873486206095", "_blank")}
        >
          Join PMA
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Briefcase, Target, ArrowRight } from "lucide-react";

interface PersonaTailoredContentProps {
  persona: string | null;
}

const personaContent = {
  curious: {
    title: "Your Journey: Exploring Product Management",
    description: "Start with the fundamentals and discover if PM is right for you",
    steps: [
      {
        title: "Learn the Basics",
        description: "Understand what product managers do daily",
        icon: <BookOpen className="h-5 w-5" />,
        action: "Explore Resources",
        link: "/resources"
      },
      {
        title: "Talk to PMs",
        description: "Have coffee chats with current product managers",
        icon: <Users className="h-5 w-5" />,
        action: "View Events",
        link: "/events"
      },
      {
        title: "Join the Community",
        description: "Attend PMA events and meet like-minded students",
        icon: <Target className="h-5 w-5" />,
        action: "Meet the Team",
        link: "/team"
      }
    ],
    resources: [
      "PM 101: Introduction to Product Management",
      "Coffee Chat Guide: Questions to Ask PMs",
      "Essential PM Reading List",
      "PM Tools Overview (Figma, Jira, Analytics)"
    ]
  },
  starting: {
    title: "Your Journey: Building PM Skills",
    description: "Develop core competencies and gain practical experience",
    steps: [
      {
        title: "Build Your Portfolio",
        description: "Document PM projects and case studies",
        icon: <Briefcase className="h-5 w-5" />,
        action: "Get Started",
        link: "/resources"
      },
      {
        title: "Practice Interviews",
        description: "Master behavioral and case interview questions",
        icon: <Target className="h-5 w-5" />,
        action: "Find Resources",
        link: "/resources"
      },
      {
        title: "Network with Alumni",
        description: "Connect with PMA alumni in PM roles",
        icon: <Users className="h-5 w-5" />,
        action: "View Events",
        link: "/events"
      }
    ],
    resources: [
      "PM Interview Frameworks (CIRCLES, AARM)",
      "Case Study Template & Examples",
      "Resume Review Checklist for PMs",
      "Mock Interview Sign-Up"
    ]
  },
  recruiting: {
    title: "Your Journey: Landing Your PM Role",
    description: "Master interviews and negotiate offers successfully",
    steps: [
      {
        title: "Perfect Your Resume",
        description: "Get professional feedback on your PM resume",
        icon: <Briefcase className="h-5 w-5" />,
        action: "Get Review",
        link: "/contact"
      },
      {
        title: "Master Case Interviews",
        description: "Complete 10+ practice case interviews",
        icon: <Target className="h-5 w-5" />,
        action: "Practice Now",
        link: "/resources"
      },
      {
        title: "Attend Recruiting Events",
        description: "Connect with companies at info sessions",
        icon: <Users className="h-5 w-5" />,
        action: "View Calendar",
        link: "/events"
      }
    ],
    resources: [
      "Company-Specific Interview Guides",
      "Offer Negotiation Strategies",
      "Recruiting Timeline Checklist",
      "PM Compensation Data"
    ]
  }
};

const PersonaTailoredContent = ({ persona }: PersonaTailoredContentProps) => {
  if (!persona || !(persona in personaContent)) {
    return null;
  }

  const content = personaContent[persona as keyof typeof personaContent];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">{content.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {content.description}
        </p>
      </div>

      {/* Next Steps Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {content.steps.map((step, index) => (
          <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white mb-4">
                {step.icon}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{step.description}</p>
              <Link to={step.link}>
                <Button className="w-full group">
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommended Resources */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recommended Resources for Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {content.resources.map((resource, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>{resource}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link to="/resources">
              <Button size="lg" variant="outline" className="w-full group">
                View All Resources
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaTailoredContent;

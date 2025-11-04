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
        description: "Understand what product managers do daily and the skills they use",
        icon: <BookOpen className="h-5 w-5" />,
        action: "Explore Resources",
        link: "/resources"
      },
      {
        title: "Talk to PMs",
        description: "Connect with current PMs through coffee chats and info sessions",
        icon: <Users className="h-5 w-5" />,
        action: "View Events",
        link: "/events"
      },
      {
        title: "Join the Community",
        description: "Attend PMA workshops and network with aspiring PMs",
        icon: <Target className="h-5 w-5" />,
        action: "Meet the Team",
        link: "/team"
      }
    ],
    resources: [
      "PM 101: What Does a Product Manager Actually Do?",
      "Coffee Chat Guide: 20 Questions to Ask PMs",
      "Essential PM Reading List & Blogs to Follow",
      "PM Tools Overview: Figma, Jira, Analytics & More",
      "Day in the Life: Real PM Stories from Alumni",
      "Is PM Right for You? Self-Assessment Quiz"
    ]
  },
  starting: {
    title: "Your Journey: Building PM Skills",
    description: "Develop core competencies and gain practical experience",
    steps: [
      {
        title: "Build Your Portfolio",
        description: "Create compelling case studies and document your PM projects",
        icon: <Briefcase className="h-5 w-5" />,
        action: "Get Started",
        link: "/resources"
      },
      {
        title: "Practice Interviews",
        description: "Master behavioral questions, product design, and case frameworks",
        icon: <Target className="h-5 w-5" />,
        action: "Find Resources",
        link: "/resources"
      },
      {
        title: "Network with Alumni",
        description: "Build relationships with PMA alumni at top tech companies",
        icon: <Users className="h-5 w-5" />,
        action: "View Events",
        link: "/events"
      }
    ],
    resources: [
      "PM Interview Frameworks: CIRCLES, AARM, and More",
      "Portfolio Building: Case Study Templates & Examples",
      "Resume Review: Get Feedback from Real PMs",
      "Mock Interview Practice: Schedule Your Session",
      "Product Teardowns: Learn by Analyzing Great Products",
      "Technical Skills for PMs: SQL, APIs, and Data Analysis"
    ]
  },
  recruiting: {
    title: "Your Journey: Landing Your PM Role",
    description: "Master interviews and negotiate offers successfully",
    steps: [
      {
        title: "Perfect Your Resume",
        description: "Get expert feedback from PMs at top companies",
        icon: <Briefcase className="h-5 w-5" />,
        action: "Get Review",
        link: "/contact"
      },
      {
        title: "Master Case Interviews",
        description: "Practice product design, strategy, and analytics cases",
        icon: <Target className="h-5 w-5" />,
        action: "Practice Now",
        link: "/resources"
      },
      {
        title: "Attend Recruiting Events",
        description: "Network at company info sessions and career fairs",
        icon: <Users className="h-5 w-5" />,
        action: "View Calendar",
        link: "/events"
      }
    ],
    resources: [
      "Company-Specific Interview Guides: Google, Meta, Amazon & More",
      "Offer Negotiation: Strategies for Maximizing Compensation",
      "Recruiting Timeline: When to Apply for Summer & Full-Time",
      "PM Compensation Data: Know Your Worth",
      "Final Round Prep: Executive Interviews & Panel Tips",
      "Onboarding Success: Your First 90 Days as a PM"
    ]
  }
};

const PersonaTailoredContent = ({ persona }: PersonaTailoredContentProps) => {
  if (!persona || !(persona in personaContent)) {
    return null;
  }

  const content = personaContent[persona as keyof typeof personaContent];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
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

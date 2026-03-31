import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  FileText, 
  Users, 
  Map, 
  Rocket, 
  Target, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";

const CURRENT_FEATURES = [
  {
    title: "Job Board",
    description: "Curated PM internships to accelerate your career search.",
    icon: Briefcase,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Resume Review",
    description: "Submit for feedback tailored specifically to PM roles.",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Mock Interviews",
    description: "Practice answering real PM questions with peers.",
    icon: Target,
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    title: "Member Directory",
    description: "Network with alumni and current PMA members.",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "PM Roadmap",
    description: "A personalized guide tracking your PM learning journey.",
    icon: Map,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

const UPCOMING_FEATURES = [
  {
    title: "Application Tracker",
    description: "Organize and track all your PM internship applications in one place."
  },
  {
    title: "Enhanced Alumni Groups",
    description: "Direct mentorship and networking hubs based on industry interests."
  },
  {
    title: "Interactive Case Prep",
    description: "Frameworks and real-world examples for product design cases."
  }
];

const MeetingPresentationPage = () => {
  // We point the QR directly to the signup path
  const signUpUrl = `${window.location.origin}/auth?signup=true`;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background overflow-hidden relative selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full opacity-50 pointer-events-none -z-10" />
      
      <div className="container max-w-6xl mx-auto px-4 space-y-24">
        
        {/* HERO SECTION */}
        <AnimatedSection animation="slide-up">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="w-4 h-4" />
                BYU Product Management Association
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Your Complete <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  PM Toolkit
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Everything you need to land your dream internship, connect with alumni, and build your product skills. All in one place.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all" asChild>
                  <Link to="/auth?signup=true">
                    Join Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  Requires <strong>@byu.edu</strong> email
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <Card className="relative bg-background border-2 border-primary/10 shadow-2xl overflow-hidden rounded-3xl p-8 flex flex-col items-center gap-4">
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="font-bold text-lg">Scan to Join</h3>
                    <p className="text-sm text-muted-foreground">Sign up instantly</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-inner">
                    <QRCode
                      value={signUpUrl}
                      size={200}
                      level="H"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2 max-w-[200px]">
                    Point your camera at the QR code to access the platform.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CURRENT FEATURES */}
        <AnimatedSection animation="slide-up" delay={150}>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What's Inside?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've built proven tools designed to help you prepare, practice, and secure your upcoming PM role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURRENT_FEATURES.map((feature, i) => (
              <Card key={i} className="group hover:shadow-lg transition-all border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        {/* UPCOMING & FEEDBACK SPLIT */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch py-12">
          {/* UPCOMING */}
          <AnimatedSection animation="slide-up" delay={200} className="h-full">
            <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Rocket className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Coming Soon</CardTitle>
                </div>
                <CardDescription className="text-base">
                  We're constantly expanding. Here's what is next on the roadmap:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {UPCOMING_FEATURES.map((feat, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{feat.title}</h4>
                        <p className="text-muted-foreground">{feat.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* HELP US IMPROVE / FEEDBACK CTA */}
          <AnimatedSection animation="slide-up" delay={300} className="h-full">
            <Card className="h-full border-2 border-primary/20 shadow-xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -z-10" />
              <CardHeader className="text-center pt-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl">We need your feedback</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6 pb-10">
                <p className="text-lg text-muted-foreground max-w-sm mx-auto">
                  This platform is built <strong>by the club, for the club</strong>. 
                  Have a great idea? Want to help write content or code?
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="rounded-full w-full sm:w-auto" asChild>
                    <a href="mailto:contact@byupmsociety.com">
                      Email Us
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto" asChild>
                    <Link to="/contact">
                      Contact Form
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>

      </div>
    </div>
  );
};

export default MeetingPresentationPage;

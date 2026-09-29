import { Link } from 'react-router-dom';
import { Bot, GraduationCap, Users, Mic, Building2, Mail, type LucideIcon } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { companyImages } from './placeholderImages';

const CONTACT_EMAIL = 'pm-assoc@byu.edu';

type EngagementOption = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  highlights: string[];
};

const engagementOptions: EngagementOption[] = [
  {
    id: 'ai-foundry',
    image: companyImages.aiFoundry,
    icon: Bot,
    title: 'Sponsor an AI Foundry Project',
    description:
      'Bring a real product problem to a team of BYU students who will scope, prototype, and ship an AI-powered solution over the semester.',
    highlights: ['Semester-long student team', 'Your problem, your data', 'Final demo and handoff'],
  },
  {
    id: 'internships',
    image: companyImages.internships,
    icon: GraduationCap,
    title: 'Offer a PM Internship for Credit',
    description:
      'Host an unpaid product management intern who earns academic credit while contributing to your roadmap, research, and launches.',
    highlights: ['Students earn BYU credit', 'Flexible part-time scope', 'Pre-vetted PMA members'],
  },
  {
    id: 'career-fair',
    image: companyImages.careerFair,
    icon: Users,
    title: 'Join the Career Fair',
    description:
      'Meet hundreds of product-minded students at the PMA career fair and connect with candidates for internships and full-time roles.',
    highlights: ['Booth or table presence', 'Direct access to PM talent', 'Resume collection'],
  },
  {
    id: 'speaker',
    image: companyImages.speaker,
    icon: Mic,
    title: 'Host a Guest Speaker or Info Session',
    description:
      'Share how product works at your company. Talks, workshops, and info sessions are some of the best-attended events we run.',
    highlights: ['In-person or virtual', 'Workshops, panels, or talks', 'Recruiting visibility'],
  },
  {
    id: 'on-site',
    image: companyImages.onSite,
    icon: Building2,
    title: 'Host PMA On-Site',
    description:
      'Invite a group of PMA members to your office for a tour, a day-in-the-life look at your product teams, and time to network.',
    highlights: ['Office tours', 'Meet your PMs', 'Build your talent pipeline'],
  },
];

export const CompaniesHero = () => (
  <section className="pt-32 pb-20 bg-muted/20">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatedSection animation="slide-up">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Partner with <span className="text-gradient">BYU PMA</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Our members are BYU's next generation of product managers. Here's how your company can work with them,
              from sponsoring a project to hiring your next intern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-secondary !text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-all drop-shadow-md"
              >
                <a href="#ways-to-engage">See ways to engage</a>
              </Button>
              <Button asChild variant="outline" className="px-8 py-3 rounded-lg text-lg font-medium">
                <a href={`mailto:${CONTACT_EMAIL}?subject=Company%20Partnership`}>Email us</a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="slide-up" delay={150}>
          <img
            src={companyImages.hero}
            alt="BYU PMA students working with company partners"
            className="w-full aspect-[3/2] object-cover rounded-2xl border border-border shadow-lg"
          />
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export const EngagementOptions = () => (
  <section id="ways-to-engage" className="py-20 scroll-mt-16">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Ways to <span className="text-gradient">Engage</span>
        </h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {engagementOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <AnimatedSection key={option.id} animation="slide-up" delay={(index % 3) * 100 + 100}>
              <div id={option.id} className="h-full bg-card/80 border border-border rounded-xl overflow-hidden flex flex-col">
                <img
                  src={option.image}
                  alt={option.title}
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6 pt-0 flex flex-col flex-1">
                  <div className="h-12 w-12 -mt-6 rounded-full bg-gradient-to-r from-primary to-secondary ring-4 ring-card flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">{option.title}</h3>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <ul className="mt-auto space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    {option.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  </section>
);

export const CompaniesCTA = () => (
  <section className="py-20 bg-muted/20">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <div className="max-w-3xl mx-auto bg-card/80 border border-border rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-card-foreground">
            Help inspire the next generation of <span className="text-gradient">product managers</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Tell us which option interests you and we'll follow up with next steps and timing for this semester.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-primary to-secondary !text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-all drop-shadow-md"
            >
              <a href={`mailto:${CONTACT_EMAIL}?subject=Company%20Partnership`}>
                <Mail className="w-5 h-5 mr-2" />
                {CONTACT_EMAIL}
              </a>
            </Button>
            <Button asChild variant="outline" className="px-8 py-3 rounded-lg text-lg font-medium">
              <Link to="/contact">Contact page</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

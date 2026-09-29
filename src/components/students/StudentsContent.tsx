import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { studentImages } from './placeholderImages';

// Kept deliberately high-level (no course numbers) so it doesn't go stale as the catalog changes.
const paths = [
  {
    title: 'Strategy',
    badge: "PMA's sponsoring program",
    fit: 'Built for product thinking.',
    description:
      "BYU Marriott's Strategy major sponsors PMA. It trains you to size markets, find a competitive edge, and make tradeoffs — the heart of deciding what a product should be.",
    image: studentImages.strategy,
  },
  {
    title: 'Information Systems',
    fit: 'One of the most common paths we see.',
    description:
      'Blends business with enough technical depth (databases, systems design, building apps) to speak fluently with engineers.',
    image: studentImages.informationSystems,
  },
  {
    title: 'Computer Science',
    fit: 'Great for technical PM roles.',
    description:
      'Engineers who move into PM bring instant credibility with dev teams. Round it out with business, design, and communication classes.',
    image: studentImages.computerScience,
  },
  {
    title: 'Business & Marketing',
    fit: 'Strong on the customer and the market.',
    description:
      'Go-to-market, pricing, and customer thinking are core PM skills. Add an intro programming or data class so technical conversations feel comfortable.',
    image: studentImages.businessMarketing,
  },
  {
    title: 'Design & UX',
    fit: 'Customer empathy from day one.',
    description:
      'Research, prototyping, and user testing are daily PM work. Pair it with some business and data coursework.',
    image: studentImages.designUX,
  },
  {
    title: 'Economics, Stats & Analytics',
    fit: 'Data-driven decision makers.',
    description:
      'PMs live in metrics and experiments. Quantitative majors translate directly into setting goals and measuring impact.',
    image: studentImages.econStats,
  },
];

const classTypes = [
  'An intro programming class — you don\'t need to be an engineer, but you should understand how software gets built',
  'Databases or data analysis (SQL and spreadsheets go a long way)',
  'UX, design thinking, or user research',
  'Marketing, strategy, or entrepreneurship',
  'Statistics and experimentation',
  'Anything that makes you write and present often',
];

const faqs = [
  {
    q: 'What does a product manager actually do day to day?',
    a: 'A PM decides what a team should build and why. Day to day that means talking to customers, looking at data, writing up problems and requirements, prioritizing the backlog, and keeping engineering, design, marketing, and leadership aligned. PMs usually don\'t write the code or make the designs — they own the outcome.',
  },
  {
    q: 'Is PM the same as project management?',
    a: 'No. Project managers focus on delivering a defined plan on time and on budget. Product managers focus on figuring out which problems are worth solving and whether the product is succeeding for users and the business. There is overlap, but PM is more about the "what" and "why" than the "when."',
  },
  {
    q: 'What major should I choose if I want to be a PM?',
    a: 'There is no single "PM major." Information Systems and Computer Science are the most common routes at BYU, but business, design, and quantitative majors all work well. Pick something you enjoy and fill the gaps with a few technical, design, and business classes.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'You don\'t need to be a professional engineer, but you do need to understand how software is built so you can make good tradeoffs and earn engineers\' trust. Technical PM roles expect more depth. Building a small side project is one of the best ways to learn.',
  },
  {
    q: 'Can I get a PM job straight out of college?',
    a: 'Yes — many companies hire new grads into associate PM (APM) or rotational programs, and PM internships are the most common way in. It is competitive, so internships, projects, and a strong network matter. Many PMs also start in engineering, design, analytics, or consulting and transition later.',
  },
  {
    q: 'When should I start recruiting for PM internships?',
    a: 'Earlier than you think. Many summer internships open the fall before, and big-tech programs can open in late summer. Start networking and building projects as a freshman or sophomore so you have stories to tell when applications open.',
  },
  {
    q: 'How do I get experience before my first PM role?',
    a: 'Build something and ship it — a side project, a hackathon entry, a club tool, or a student startup. Take on product-like responsibilities in any job or club. PMA events, the hackathon, and mock interviews are designed to give you exactly these reps.',
  },
  {
    q: 'What are PM interviews like?',
    a: 'Expect product sense ("design a product for…"), analytical and metrics questions, estimation, some technical questions, and behavioral questions about leadership and conflict. Practice out loud — our mock interview program pairs you with other members to do exactly that.',
  },
];

export const StudentsHero = () => (
  <section className="lg:min-h-[85vh] flex items-center relative overflow-hidden py-16 md:py-32">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 dark:bg-secondary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full filter blur-3xl"></div>
    </div>

    <div className="container mx-auto px-4 md:px-6 z-10 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <AnimatedSection animation="fade-in">
            <h1 className="text-center md:text-left text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Path Into <span className="text-gradient">Product Management</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={300}>
            <p className="text-center md:text-left text-xl md:text-2xl text-muted-foreground mt-6">
              Majors, classes, and answers to the questions BYU students ask us most.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={600}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
              <a
                href="#paths"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl !text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Majors & Classes
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium hover:bg-white/10 transition-all"
              >
                Read the FAQ
              </a>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="slide-up" className="flex justify-center mt-4 lg:mt-0">
          <img
            src={studentImages.hero}
            alt=""
            className="w-full max-w-[600px] aspect-[4/3] object-cover rounded-xl shadow-lg"
          />
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export const PathsIntoPM = () => (
  <section id="paths" className="py-20">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Majors & Classes That <span className="text-gradient">Lead to PM</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            There is no single right path. These are the routes we see most often among BYU students who land PM roles.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paths.map((path, i) => (
          <AnimatedSection key={path.title} animation="slide-up" delay={100 * (i % 3 + 1)}>
            <div className="bg-card/80 border border-border rounded-xl overflow-hidden h-full flex flex-col">
              <div className="relative h-40">
                <img src={path.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                {path.badge && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {path.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-card-foreground">{path.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{path.fit}</p>
                <p className="text-muted-foreground">{path.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
      <AnimatedSection animation="slide-up" delay={100}>
        <div className="mt-12 bg-card/80 border border-border rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-2 text-card-foreground">What about other majors?</h3>
            <p className="text-muted-foreground mb-6">
              PMs come from engineering, psychology, English, and everywhere else. What matters is curiosity,
              communication, and proof that you can ship things. Whatever your major, look for classes in:
            </p>
            <ul className="space-y-3">
              {classTypes.map((item) => (
                <li key={item} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-6">
              Course numbers change, so check the current catalog or ask a PMA officer for today's favorites.
            </p>
          </div>
          <img
            src={studentImages.anyMajor}
            alt=""
            loading="lazy"
            className="w-full h-64 lg:h-full object-cover order-first lg:order-none"
          />
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export const StudentFAQ = () => (
  <section id="faq" className="py-20 bg-muted/20">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Questions We Get <span className="text-gradient">All the Time</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Don't see yours? <Link to="/contact" className="text-primary hover:underline">Ask us</Link>.
          </p>
        </div>
      </AnimatedSection>
      <AnimatedSection animation="slide-up" delay={100}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <img
          src={studentImages.faq}
          alt=""
          loading="lazy"
          className="hidden lg:block lg:col-span-2 w-full h-[520px] object-cover rounded-xl lg:sticky lg:top-24"
        />
        <div className="lg:col-span-3 bg-card/80 border border-border rounded-xl px-6 md:px-8">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className={i === faqs.length - 1 ? 'border-b-0' : ''}>
                <AccordionTrigger className="text-left text-lg text-card-foreground hover:no-underline hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

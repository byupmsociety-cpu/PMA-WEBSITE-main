import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AnimatedSection from '@/components/AnimatedSection';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types for the quiz
type YearInSchool = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
type ExperienceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type InternshipType = 'PM' | 'Non-PM' | 'None';
type InterestArea = 'UX' | 'Technical' | 'GTM' | 'Leadership' | 'Data' | 'Strategy';
type SkillFocus = 'Technical' | 'Leadership' | 'Analytical' | 'Communication';

interface QuizAnswers {
  yearInSchool: YearInSchool;
  major: string;
  experience: {
    coding: ExperienceLevel;
    design: ExperienceLevel;
    businessStrategy: ExperienceLevel;
    productManagement: ExperienceLevel;
  };
  internship: InternshipType;
  interests: InterestArea[];
  skillFocus: SkillFocus[];
}

interface Roadmap {
  major: string[];
  classes: string[];
  clubs: string[];
  projects: string[];
  internships: string[];
  skills: string[];
  tools: string[];
  events: string[];
  alumniConnections: string[];
}

const majors = [
  'Computer Science',
  'Information Systems',
  'Business Management',
  'Marketing',
  'Finance',
  'Economics',
  'Design',
  'Other'
];

const interestAreas = [
  { value: 'UX', label: 'UX/Design' },
  { value: 'Technical', label: 'Technical PM' },
  { value: 'GTM', label: 'Go-to-Market Strategy' },
  { value: 'Leadership', label: 'PM Leadership' },
  { value: 'Data', label: 'Data & Analytics' },
  { value: 'Strategy', label: 'Product Strategy' }
];

const skillFocuses = [
  { value: 'Technical', label: 'Technical Skills' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Analytical', label: 'Analytical Thinking' },
  { value: 'Communication', label: 'Communication' }
];

const pmSkills = [
  {
    name: "A/B Testing",
    description: "A/B testing (also known as split testing) is an experiment where you compare two versions of something—Version A and Version B—to see which one performs better.",
    learnMore: "https://www.youtube.com/watch?v=8HtD_zkDNfQ",
    activity: "Try running an A/B test on your personal website's call-to-action button"
  },
  {
    name: "AI Prototyping",
    description: "AI prototyping is building a very quick MVP to get the point across to developers on what to build. True MVPs can be 'live' after creation.",
    learnMore: "https://www.youtube.com/watch?v=example",
    activity: "Build a personal website MVP using AI tools"
  },
  {
    name: "User Research",
    description: "User research involves understanding user behaviors, needs, and motivations through observation techniques, task analysis, and other feedback methodologies.",
    learnMore: "https://www.youtube.com/watch?v=example",
    activity: "Conduct 5 user interviews about a product you use daily"
  },
  {
    name: "Data Analysis",
    description: "Data analysis is the process of systematically applying statistical and/or logical techniques to describe and illustrate, condense and recap, and evaluate data.",
    learnMore: "https://www.youtube.com/watch?v=example",
    activity: "Analyze your personal website's Google Analytics data"
  },
  {
    name: "Product Strategy",
    description: "Product strategy is the process of defining what you want to achieve and how you plan to get there. It's about making choices about what to build and why.",
    learnMore: "https://www.youtube.com/watch?v=example",
    activity: "Create a product strategy for a new feature on your favorite app"
  }
];

const pmJargon = [
  { term: "MVP", definition: "Minimum Viable Product - The most basic version of a product that can be released to gather feedback" },
  { term: "OKR", definition: "Objectives and Key Results - A goal-setting framework used to define and track objectives and their outcomes" },
  { term: "KPI", definition: "Key Performance Indicator - A measurable value that demonstrates how effectively a company is achieving key business objectives" },
  { term: "PRD", definition: "Product Requirements Document - A document that describes what a product should do" },
  { term: "Backlog", definition: "A prioritized list of work items that need to be completed" },
  { term: "User Story", definition: "A description of a feature from the user's perspective" },
  { term: "Sprint", definition: "A time-boxed period during which specific work has to be completed" },
  { term: "Roadmap", definition: "A strategic plan that defines a goal or desired outcome" },
  { term: "Wireframe", definition: "A visual guide that represents the skeletal framework of a website" },
  { term: "Stakeholder", definition: "A person with an interest or concern in the product" }
];

const dailyChallenges = [
  {
    title: "Daily PM Challenge",
    challenge: "Write a user story for a new feature in this format:\nAs a [user type],\nI want to [action],\nSo that [benefit]",
    example: "As a student,\nI want to save my favorite PM resources,\nSo that I can easily access them later",
    placeholder: "As a...\nI want to...\nSo that..."
  },
  {
    title: "Daily PM Challenge",
    challenge: "Write a product requirement for a new feature in this format:\nFeature: [name]\nPriority: [High/Medium/Low]\nDescription: [what it does]",
    example: "Feature: Resource Bookmarking\nPriority: High\nDescription: Allow users to save and organize PM learning resources",
    placeholder: "Feature:...\nPriority:...\nDescription:..."
  },
  {
    title: "Daily PM Challenge",
    challenge: "Write a KPI for a new feature in this format:\nMetric: [name]\nTarget: [number]\nTimeframe: [period]",
    example: "Metric: User Engagement\nTarget: 75%\nTimeframe: First month",
    placeholder: "Metric:...\nTarget:...\nTimeframe:..."
  }
];

const generateRoadmap = (answers: QuizAnswers): Roadmap => {
  const roadmap: Roadmap = {
    major: [],
    classes: [],
    clubs: [],
    projects: [],
    internships: [],
    skills: [],
    tools: [],
    events: [],
    alumniConnections: []
  };

  // Major recommendations
  if (answers.yearInSchool === 'Freshman' || answers.yearInSchool === 'Sophomore') {
    roadmap.major.push('Consider IS 201: Introduction to Information Systems');
    roadmap.major.push('Take CS 142: Introduction to Computer Programming');
    roadmap.major.push('Consider a minor in Computer Science or Business');
  }

  // Classes based on interests
  if (answers.interests.includes('UX')) {
    roadmap.classes.push('DESIGN 201: Introduction to Design');
    roadmap.classes.push('IS 303: User Experience Design');
  }
  if (answers.interests.includes('Technical')) {
    roadmap.classes.push('CS 235: Data Structures');
    roadmap.classes.push('IS 401: Systems Analysis and Design');
  }
  if (answers.interests.includes('Data')) {
    roadmap.classes.push('IS 201: Introduction to Information Systems');
    roadmap.classes.push('STAT 121: Principles of Statistics');
  }

  // Clubs and organizations
  roadmap.clubs.push('PMA (Product Management Association)');
  roadmap.clubs.push('UX Club');
  if (answers.interests.includes('Technical')) {
    roadmap.clubs.push('ACM (Association for Computing Machinery)');
  }
  if (answers.interests.includes('GTM')) {
    roadmap.clubs.push('Business Strategy Club');
  }

  // Project recommendations
  if (answers.experience.coding < 5) {
    roadmap.projects.push('Build a simple web application using HTML, CSS, and JavaScript');
  }
  if (answers.interests.includes('UX')) {
    roadmap.projects.push('Create a UX case study for a popular app');
  }
  if (answers.interests.includes('Data')) {
    roadmap.projects.push('Analyze a dataset and create visualizations');
  }

  // Internship recommendations
  if (answers.internship === 'None') {
    roadmap.internships.push('Apply for PM internships at tech companies');
    roadmap.internships.push('Consider product marketing internships');
  }

  // Skills to build
  if (answers.skillFocus.includes('Technical')) {
    roadmap.skills.push('Learn basic SQL');
    roadmap.skills.push('Understand API basics');
  }
  if (answers.skillFocus.includes('Communication')) {
    roadmap.skills.push('Practice writing PRDs');
    roadmap.skills.push('Work on presentation skills');
  }

  // Tools to learn
  roadmap.tools.push('Figma');
  roadmap.tools.push('Jira');
  if (answers.interests.includes('Data')) {
    roadmap.tools.push('SQL');
    roadmap.tools.push('Tableau');
  }

  // PMA events
  roadmap.events.push('PMA Weekly Meetings');
  roadmap.events.push('PM Case Study Workshops');
  roadmap.events.push('Alumni Networking Events');

  // Alumni connections
  roadmap.alumniConnections.push('Connect with PMs at tech companies');
  roadmap.alumniConnections.push('Join the PMA Alumni LinkedIn group');

  return roadmap;
};

const DiscoverPage = () => {
  // const [, setShowQuiz] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    yearInSchool: 'Freshman',
    major: '',
    experience: {
      coding: 1,
      design: 1,
      businessStrategy: 1,
      productManagement: 1
    },
    internship: 'None',
    interests: [],
    skillFocus: []
  });
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<typeof pmSkills[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [quizTerm, setQuizTerm] = useState<typeof pmJargon[0] | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showExample, setShowExample] = useState(false);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      const generatedRoadmap = generateRoadmap(answers);
      setRoadmap(generatedRoadmap);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const randomRotation = 1800 + Math.random() * 1800; // 5-10 full rotations
    setRotation(rotation + randomRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const selectedIndex = Math.floor(Math.random() * pmSkills.length);
      setSelectedSkill(pmSkills[selectedIndex]);
    }, 3000);
  };

  const startNewQuiz = () => {
    const randomIndex = Math.floor(Math.random() * pmJargon.length);
    setQuizTerm(pmJargon[randomIndex]);
    setShowDefinition(false);
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleGuess = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowDefinition(true);
  };

  const handleNextChallenge = () => {
    setCurrentChallenge((prev) => (prev + 1) % dailyChallenges.length);
    setUserInput('');
    setShowExample(false);
  };

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  const renderQuizStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">What year are you in school?</h3>
            <RadioGroup
              value={answers.yearInSchool}
              onValueChange={(value) => setAnswers({ ...answers, yearInSchool: value as YearInSchool })}
              className="space-y-2"
            >
              {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <RadioGroupItem value={year} id={year} />
                  <Label htmlFor={year}>{year}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">What is your major?</h3>
            <Select
              value={answers.major}
              onValueChange={(value) => setAnswers({ ...answers, major: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your major" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4">Rate your experience level (1-10)</h3>
            {Object.entries(answers.experience).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Slider
                  value={[value]}
                  onValueChange={([newValue]) => 
                    setAnswers({
                      ...answers,
                      experience: { ...answers.experience, [key]: newValue as ExperienceLevel }
                    })
                  }
                  min={1}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>No Experience</span>
                  <span>Professional</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Have you had an internship before?</h3>
            <RadioGroup
              value={answers.internship}
              onValueChange={(value) => setAnswers({ ...answers, internship: value as InternshipType })}
              className="space-y-2"
            >
              {['PM', 'Non-PM', 'None'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">What are you most interested in? (Select all that apply)</h3>
            <div className="grid grid-cols-2 gap-4">
              {interestAreas.map((area) => (
                <div key={area.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={area.value}
                    checked={answers.interests.includes(area.value as InterestArea)}
                    onChange={(e) => {
                      const newInterests = e.target.checked
                        ? [...answers.interests, area.value as InterestArea]
                        : answers.interests.filter((i) => i !== area.value);
                      setAnswers({ ...answers, interests: newInterests });
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={area.value}>{area.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">What skills do you want to build most this year? (Select all that apply)</h3>
            <div className="grid grid-cols-2 gap-4">
              {skillFocuses.map((skill) => (
                <div key={skill.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={skill.value}
                    checked={answers.skillFocus.includes(skill.value as SkillFocus)}
                    onChange={(e) => {
                      const newSkills = e.target.checked
                        ? [...answers.skillFocus, skill.value as SkillFocus]
                        : answers.skillFocus.filter((s) => s !== skill.value);
                      setAnswers({ ...answers, skillFocus: newSkills });
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={skill.value}>{skill.label}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!roadmap) return null;

    const exportToCSV = () => {
      // Create CSV content
      const sections = [
        { title: 'Academic Path', items: roadmap.major },
        { title: 'Recommended Classes', items: roadmap.classes },
        { title: 'Clubs & Organizations', items: roadmap.clubs },
        { title: 'Project Ideas', items: roadmap.projects },
        { title: 'Internship Opportunities', items: roadmap.internships },
        { title: 'Skills to Develop', items: roadmap.skills },
        { title: 'Tools to Learn', items: roadmap.tools },
        { title: 'PMA Events to Attend', items: roadmap.events },
        { title: 'Alumni Connections', items: roadmap.alumniConnections }
      ];

      let csvContent = 'Section,Item\n';
      sections.forEach(section => {
        section.items.forEach(item => {
          csvContent += `${section.title},"${item}"\n`;
        });
      });

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'pm_roadmap.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-2 py-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Your Personalized PM Roadmap</h3>
          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md"
          >
            Export Roadmap
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Academic Path</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.major.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Recommended Classes</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.classes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Clubs & Organizations</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.clubs.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Project Ideas</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.projects.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Internship Opportunities</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.internships.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Skills to Develop</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.skills.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Tools to Learn</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.tools.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">PMA Events to Attend</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.events.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Alumni Connections</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {roadmap.alumniConnections.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Video */}
      <section
        className="relative w-screen h-screen overflow-hidden"
        style={{ minWidth: '100vw', minHeight: '100vh' }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-125 transition-transform duration-700"
          preload="auto"
        >
          <source
            src="https://res.cloudinary.com/ddscxev8c/video/upload/v1747668238/qj6v0ltaqnrty0pwtozw.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full w-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your <span className="text-gradient">Product Management</span> Path
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
            ↓ Build your BYU-customized path to a Product Management Career ↓
            </p>
            <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-all drop-shadow-md">
                  Take the PM Quiz
                </Button>
              </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-card/95 border border-border">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {roadmap ? 'Your PM Roadmap' : `PM Quiz - Step ${currentStep} of 6`}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {roadmap ? (
                      renderResults()
                    ) : (
                      <>
                        {renderQuizStep()}
                        <div className="flex justify-between mt-6">
                          {currentStep > 1 && (
                            <Button
                              onClick={handleBack}
                              variant="outline"
                              className="border-border hover:bg-muted"
                            >
                              Back
                            </Button>
                          )}
                      <Button 
                            onClick={handleNext}
                            className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md"
                      >
                            {currentStep === 6 ? 'Get Results' : 'Next'}
                      </Button>
                    </div>
                      </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* What is PM Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is Product <span className="text-gradient">Management?</span></h2>
              <p className="text-lg text-muted-foreground">
              Product management is the intersection of business strategy, software engineering, and user experience. 
              A PM speaks the language of engineers and business executives while focusing on the needs of the product user. 
              Product Managers are customer obsessed!
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={100}>
              <div className="bg-card/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Vision & Strategy</h3>
                <p className="text-muted-foreground">
                  Define product vision, set strategic goals, and create roadmaps that align with business objectives.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
              <div className="bg-card/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">User Focus</h3>
                <p className="text-muted-foreground">
                  Understand user needs, conduct research, and ensure products solve real problems for real users.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={300}>
              <div className="bg-card/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Execution</h3>
                <p className="text-muted-foreground">
                  Work with cross-functional teams to build, launch, and iterate on products that deliver value.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why PM Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatedSection animation="slide-up">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/80 border border-border rounded-2xl p-8 md:p-12 transform hover:scale-[1.02] transition-transform duration-300">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-card-foreground">
                  So is Product Management really <span className="text-gradient">worth it?</span>
                  <br></br>Uhhh you tell me... 
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-card-foreground">Work-Life Balance</h3>
                    <p className="text-muted-foreground">Flexible schedules and remote work options that let you maintain a healthy lifestyle</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-card-foreground">Impactful Projects</h3>
                    <p className="text-muted-foreground">Work on exciting products that directly impact business growth and user experience</p>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-card-foreground">Competitive Salary</h3>
                    <p className="text-muted-foreground">Average salary of $90K-$150K, with senior PMs earning up to $200K+</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Key Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Skills for <span className="text-gradient">Success</span></h2>
              <p className="text-lg text-muted-foreground">
                Advice from Expert PMs and BYU Almuni
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedSection animation="slide-up" delay={100}>
              <div className="bg-card/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-card-foreground">Technical Skills</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Data Analysis & Metrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Coding experience (or at least an understanding)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">AI Prototyping / Prompt Engineering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">User Research</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Competitive Analysis</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slide-up" delay={200}>
              <div className="bg-card/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-card-foreground">Soft Skills</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Communication (concise and able to collaborate among multiple teams)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Leadership (be a leader without "authority")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Problem Solving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Bias for Action</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">Always curious</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games-section" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Learn PM Through <span className="text-gradient">Games</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column with Skill Generator */}
            <div className="space-y-12">
              <AnimatedSection animation="slide-up" delay={100}>
                <div className="bg-card/80 border border-border rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-card-foreground">PM Skill Generator</h3>
                  <div className="flex flex-col items-center space-y-6">
                    <div 
                      className="w-64 h-64 rounded-full border-4 border-primary relative cursor-pointer"
                      onClick={spinWheel}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)' : 'none'
                      }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary transform -translate-y-1/2"></div>
                    </div>
                    <Button
                      onClick={spinWheel}
                      disabled={isSpinning}
                      className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md"
                    >
                      {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                    </Button>
                    {selectedSkill && (
                      <div className="text-center space-y-4">
                        <h4 className="text-xl font-bold text-card-foreground">{selectedSkill.name}</h4>
                        <p className="text-muted-foreground">{selectedSkill.description}</p>
                        <div className="space-y-2">
                          <a
                            href={selectedSkill.learnMore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline block"
                          >
                            Learn More
                          </a>
                          <p className="text-muted-foreground">{selectedSkill.activity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right column with Jargon Quiz and Daily Challenge */}
            <div className="space-y-12">
              <AnimatedSection animation="slide-up" delay={200}>
                <div className="bg-card/80 border border-border rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6 text-card-foreground">PM Jargon Quiz</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-xl mb-2">Score: {score}</p>
                      <p className="text-2xl font-bold mb-4">{quizTerm?.term}</p>
                      {showDefinition ? (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{quizTerm?.definition}</p>
                          <Button
                            onClick={startNewQuiz}
                            className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md"
                          >
                            Next Term
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">Do you know what this means?</p>
                          <div className="flex justify-center space-x-4">
                            <Button
                              onClick={() => handleGuess(true)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={() => handleGuess(false)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* PM Daily Challenge */}
              <AnimatedSection animation="slide-up" delay={300}>
                <div className="bg-card/80 border border-border rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-4 text-card-foreground">{dailyChallenges[currentChallenge].title}</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground mb-4">{dailyChallenges[currentChallenge].challenge}</p>
                    <textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder={dailyChallenges[currentChallenge].placeholder}
                      className="w-full h-32 bg-muted/50 border border-border rounded-lg p-3 text-foreground resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={toggleExample}
                        variant="outline"
                        className="border-border hover:bg-muted"
                      >
                        {showExample ? 'Hide Example' : 'Show Example'}
                      </Button>
                      <Button
                        onClick={handleNextChallenge}
                        className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md"
                      >
                        Next Challenge
                      </Button>
                    </div>
                    {showExample && (
                      <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
                        <p className="text-muted-foreground whitespace-pre-line">{dailyChallenges[currentChallenge].example}</p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage; 
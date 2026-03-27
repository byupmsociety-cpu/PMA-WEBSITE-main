export type YearInSchool = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';
export type ExperienceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type InternshipType = 'PM' | 'Non-PM' | 'None';
export type InterestArea = 'UX' | 'Technical' | 'GTM' | 'Leadership' | 'Data' | 'Strategy';
export type SkillFocus = 'Technical' | 'Leadership' | 'Analytical' | 'Communication';

export interface QuizAnswers {
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

export interface Roadmap {
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

export const majors = [
  'Computer Science',
  'Information Systems',
  'Business Management',
  'Marketing',
  'Finance',
  'Economics',
  'Design',
  'Other'
];

export const interestAreas = [
  { value: 'UX', label: 'UX/Design' },
  { value: 'Technical', label: 'Technical PM' },
  { value: 'GTM', label: 'Go-to-Market Strategy' },
  { value: 'Leadership', label: 'PM Leadership' },
  { value: 'Data', label: 'Data & Analytics' },
  { value: 'Strategy', label: 'Product Strategy' }
];

export const skillFocuses = [
  { value: 'Technical', label: 'Technical Skills' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Analytical', label: 'Analytical Thinking' },
  { value: 'Communication', label: 'Communication' }
];

export const pmSkills = [
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

export const pmJargon = [
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

export const dailyChallenges = [
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

export const generateRoadmap = (answers: QuizAnswers): Roadmap => {
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

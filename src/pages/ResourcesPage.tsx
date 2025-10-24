import { useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Linkedin, Building2, Coffee, Briefcase, Cpu, ArrowLeft, Search } from 'lucide-react';
import resumegeniusImg from '@/assets/resumegenius.jpg';
import vmockImg from '@/assets/vmock.jpg';
import igotanofferImg from '@/assets/igotanoffer.jpg';
import pmflabsImg from '@/assets/pmflabs.jpg';
import productHavenImg from '@/assets/product-haven.jpg';
import linkedinGuideImg from '@/assets/linkedin-guide.jpg';
import hubspotLinkedinImg from '@/assets/hubspot-linkedin.jpg';
import glassdoorImg from '@/assets/glassdoor.jpg';
import levelsFyiImg from '@/assets/levels-fyi.jpg';
import coffeeChatImg from '@/assets/coffee-chat.jpg';
import newgradJobsImg from '@/assets/newgrad-jobs.jpg';
import internListImg from '@/assets/intern-list.jpg';
import linkedinJobsImg from '@/assets/linkedin-jobs.jpg';
import apmSeasonImg from '@/assets/apm-season.jpg';
import jobrightImg from '@/assets/jobright.jpg';
import lovableImg from '@/assets/lovable.jpg';
import azureAiImg from '@/assets/azure-ai.jpg';
import huggingfaceImg from '@/assets/huggingface.jpg';
import vertexAiImg from '@/assets/vertex-ai.jpg';
import aiStudioImg from '@/assets/ai-studio.jpg';
import firebaseStudioImg from '@/assets/firebase-studio.jpg';
import cursorImg from '@/assets/cursor.jpg';
import relayImg from '@/assets/relay.jpg';

interface Resource {
  title: string;
  description: string;
  url: string;
  image: string;
  tips?: string[];
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  resources: Resource[];
}

const categories: Category[] = [
  {
    id: 'resume-interview',
    title: 'Resume & Interview Guide',
    description: 'Build a standout resume and ace your interviews',
    icon: <FileText className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    resources: [
      { 
        title: 'ResumeGenius', 
        description: 'Access professional resume templates and tips.', 
        url: 'https://www.resumegenius.com',
        image: resumegeniusImg,
        tips: [
          'Make sure each line in your resume goes all the way across the page',
          'Each bullet point should be a powerful one liner showcasing PM skills',
          'Tailor your resume to PM skills - showcase creative projects, leadership, passion for building',
          'Focus on quantifiable achievements and business impact',
          'Use action verbs'
        ]
      },
      { 
        title: 'Vmock', 
        description: 'Get instant feedback on your resume with AI-powered analysis.', 
        url: 'https://www.vmock.com',
        image: vmockImg
      },
      { 
        title: 'IGotAnOffer', 
        description: 'Learn how to craft a standout product manager resume.', 
        url: 'https://igotanoffer.com/blogs/product-manager/product-manager-resume',
        image: igotanofferImg
      },
      { 
        title: 'PMF Labs', 
        description: 'Use AI tools to practice and improve your interview skills.', 
        url: 'https://www.pmflabs.ai',
        image: pmflabsImg,
        tips: [
          'Practice, practice, practice',
          'Find common interview questions and write out concise stories',
          'Practice at least once a week with a friend or tool'
        ]
      },
      { 
        title: 'Product Haven Slack', 
        description: 'Join aspiring PMs for interview prep and job listings.', 
        url: 'https://producthaven.slack.com/archives/C05SRL7THV2',
        image: productHavenImg
      }
    ]
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Optimization',
    description: 'Perfect your LinkedIn profile to attract recruiters',
    icon: <Linkedin className="w-6 h-6" />,
    color: 'from-blue-600 to-blue-400',
    resources: [
      { 
        title: "LinkedIn's Official Guide", 
        description: "Explore LinkedIn's tips and best practices for optimizing your profile.", 
        url: 'https://www.linkedin.com/help/linkedin/answer/4443',
        image: linkedinGuideImg,
        tips: [
          'Show your personality - recruiters assess cultural fit',
          'Be involved - make posts, share updates, comment to increase visibility',
          'Follow people and companies you\'re interested in'
        ]
      },
      { 
        title: "HubSpot's LinkedIn Tips", 
        description: "Learn how to optimize your LinkedIn profile with HubSpot's comprehensive guide.", 
        url: 'https://blog.hubspot.com/marketing/linkedin-profile-tips',
        image: hubspotLinkedinImg
      }
    ]
  },
  {
    id: 'company-research',
    title: 'Company Research',
    description: 'Research companies and understand their culture',
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    resources: [
      { 
        title: 'Glassdoor', 
        description: 'Read company reviews and learn about their culture.', 
        url: 'https://www.glassdoor.com',
        image: glassdoorImg,
        tips: [
          'Create a list of your top 10 target companies',
          'Explore company websites and news articles',
          'Consider locations, reviews, and salary insights',
          'Ensure it\'s a company or product you\'re excited about'
        ]
      },
      { 
        title: 'Levels.fyi', 
        description: 'Get insights on salary levels. These tend to be pretty accurate!', 
        url: 'https://www.levels.fyi',
        image: levelsFyiImg
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Coffee Chats',
    description: 'Connect with industry professionals and build relationships',
    icon: <Coffee className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    resources: [
      { 
        title: 'Coffee Chat Guide', 
        description: 'Learn how to conduct effective coffee chats and informational interviews.', 
        url: '#',
        image: coffeeChatImg,
        tips: [
          'Connect with BYU alumni and conduct informational interviews',
          'Learn about their company, projects, and culture',
          'Make it friendly and get to know them personally',
          'Ask if they would be willing to provide a referral',
          'Get insider tips on how to stand out as an applicant'
        ]
      }
    ]
  },
  {
    id: 'job-search',
    title: 'Job Search Tools',
    description: 'Find and apply for PM positions and internships',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    resources: [
      { 
        title: 'NewGrad Jobs', 
        description: 'Explore entry-level job opportunities for new graduates.', 
        url: 'https://www.newgrad-jobs.com',
        image: newgradJobsImg,
        tips: [
          'Use job search engines and company career pages',
          'Set alerts for positions matching your criteria',
          'Customize your resume and cover letter for each application',
          'Try to get a referral before applying'
        ]
      },
      { 
        title: 'Intern List', 
        description: 'Find internships and entry-level positions across various industries.', 
        url: 'https://www.intern-list.com',
        image: internListImg
      },
      { 
        title: 'LinkedIn Jobs', 
        description: 'Find job openings and connect with recruiters on LinkedIn.', 
        url: 'https://www.linkedin.com/jobs/',
        image: linkedinJobsImg
      },
      { 
        title: 'APM Season', 
        description: 'Stay up-to-date on the latest APM programs and internships for aspiring product managers.', 
        url: 'https://www.apmseason.com',
        image: apmSeasonImg
      },
      { 
        title: 'Jobright', 
        description: 'Utilize AI to find job matches and streamline your job search process.', 
        url: 'https://jobright.ai',
        image: jobrightImg
      }
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools to Build',
    description: 'Build projects with cutting-edge AI tools',
    icon: <Cpu className="w-6 h-6" />,
    color: 'from-violet-500 to-purple-500',
    resources: [
      { title: 'Lovable.dev', description: 'Create apps and websites by chatting with AI.', url: 'https://lovable.dev', image: lovableImg },
      { title: 'Azure AI', description: 'Explore AI solutions with Azure.', url: 'https://ai.azure.com', image: azureAiImg },
      { title: 'Hugging Face', description: 'Collaborate on models, datasets, and applications.', url: 'https://huggingface.co', image: huggingfaceImg },
      { title: 'Google Vertex AI', description: 'Build and deploy AI models on Google Cloud.', url: 'https://console.cloud.google.com/vertex-ai/studio', image: vertexAiImg },
      { title: 'AI Studio', description: 'Create AI-driven applications with Google.', url: 'https://aistudio.google.com/prompts/new_chat', image: aiStudioImg },
      { title: 'Firebase Studio', description: 'Accelerate development with AI agents.', url: 'https://firebase.studio', image: firebaseStudioImg },
      { title: 'Cursor', description: 'AI code editor with a free year subscription for students.', url: 'https://cursor.com/en', image: cursorImg },
      { title: 'Relay.app', description: 'Create AI agents that work for you with Relay.app.', url: 'https://www.relay.app', image: relayImg }
    ]
  }
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchResults = searchQuery ? categories.flatMap(category => 
    category.resources
      .filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(resource => ({ resource, category }))
  ) : [];

  const filteredCategories = categories.filter(category => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      category.title.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.resources.some(resource => 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)
      )
    );
  });

  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.id === selectedCategory) 
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PM <span className="text-gradient bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Content Library</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to excel in your product management journey
            </p>
            
            {!selectedCategory && (
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-base"
                />
              </div>
            )}
          </div>
        </AnimatedSection>

        {selectedCategory ? (
          // Detail View
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to all categories
            </button>

            {selectedCategoryData && (
              <AnimatedSection animation="fade-in">
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${selectedCategoryData.color} p-4 rounded-lg text-white mb-4`}>
                    {selectedCategoryData.icon}
                    <h2 className="text-2xl font-bold">{selectedCategoryData.title}</h2>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedCategoryData.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCategoryData.resources.map((resource, idx) => (
                    <AnimatedSection key={idx} animation="slide-up" delay={idx * 100}>
                      <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img 
                            src={resource.image} 
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3 text-card-foreground">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                          
                          {resource.tips && (
                            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                              <h4 className="text-sm font-semibold mb-2 text-foreground">Pro Tips:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {resource.tips.map((tip, tipIdx) => (
                                  <li key={tipIdx} className="text-xs text-muted-foreground">{tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <a 
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                          >
                            View Resource
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        ) : searchQuery && searchResults.length > 0 ? (
          // Search Results View
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-6">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map(({ resource, category }, idx) => (
                <AnimatedSection key={idx} animation="slide-up" delay={idx * 50}>
                  <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-xs`}>
                          {category.icon}
                        </div>
                        <span className="text-xs text-muted-foreground">{category.title}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-card-foreground">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                      
                      {resource.tips && (
                        <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Pro Tips:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {resource.tips.map((tip, tipIdx) => (
                              <li key={tipIdx} className="text-xs text-muted-foreground">{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <a 
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        View Resource
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          // No Results
          <div className="max-w-6xl mx-auto text-center py-12">
            <p className="text-muted-foreground">No resources found matching "{searchQuery}"</p>
          </div>
        ) : (
          // Category Grid View
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, idx) => (
              <AnimatedSection key={category.id} animation="slide-up" delay={idx * 100}>
                <Card 
                  className="h-full bg-card/80 backdrop-blur-sm border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category.resources.length} resources
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;

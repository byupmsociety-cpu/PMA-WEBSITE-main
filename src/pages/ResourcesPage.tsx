import React, { useState } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const resources = [
  {
    category: 'Resume & Interview Guides',
    items: [
      { title: 'ResumeGenius', description: 'Access professional resume templates and tips.', url: 'https://www.resumegenius.com' },
      { title: 'Vmock', description: 'Get instant feedback on your resume with Vmock.', url: 'https://www.vmock.com' },
      { title: 'IGotAnOffer', description: 'Learn how to craft a standout product manager resume.', url: 'https://igotanoffer.com/blogs/product-manager/product-manager-resume' },
      { title: "LinkedIn's Official Guide", description: "Explore LinkedIn's tips and best practices for optimizing your profile.", url: 'https://www.linkedin.com/help/linkedin/answer/4443' },
      { title: "HubSpot's LinkedIn Tips", description: "Learn how to optimize your LinkedIn profile with HubSpot's comprehensive guide.", url: 'https://blog.hubspot.com/marketing/linkedin-profile-tips' },
      { title: 'Coffee Chat Guide', description: 'Learn how to conduct effective coffee chats and informational interviews.', url: '#' },
      { title: 'PMF Labs', description: 'Use AI tools to practice and improve your interview skills.', url: 'https://www.pmflabs.ai' }
    ]
  },
  {
    category: 'AI Tools to Build',
    items: [
      { title: 'Lovable.dev', description: 'Create apps and websites by chatting with AI.', url: 'https://lovable.dev' },
      { title: 'Azure AI', description: 'Explore AI solutions with Azure.', url: 'https://ai.azure.com' },
      { title: 'Hugging Face', description: 'Collaborate on models, datasets, and applications.', url: 'https://huggingface.co' },
      { title: 'Google Vertex AI', description: 'Build and deploy AI models on Google Cloud.', url: 'https://console.cloud.google.com/vertex-ai/studio' },
      { title: 'AI Studio', description: 'Create AI-driven applications with Google.', url: 'https://aistudio.google.com/prompts/new_chat' },
      { title: 'Firebase Studio', description: 'Accelerate development with AI agents.', url: 'https://firebase.studio' },
      { title: 'Cursor', description: 'AI code editor with a free year subscription for students.', url: 'https://cursor.com/en' },
      { title: 'Relay.app', description: 'Create AI agents that work for you with Relay.app.', url: 'https://www.relay.app' }
    ]
  },
  {
    category: 'Job Search Tools',
    items: [
      { title: 'NewGrad Jobs', description: 'Explore entry-level job opportunities for new graduates.', url: 'https://www.newgrad-jobs.com' },
      { title: 'Intern List', description: 'Find internships and entry-level positions across various industries.', url: 'https://www.intern-list.com' },
      { title: 'LinkedIn Jobs', description: 'Find job openings and connect with recruiters on LinkedIn.', url: 'https://www.linkedin.com/jobs/' },
      { title: 'APM Season', description: 'Stay up-to-date on the latest APM programs and internships for aspiring product managers.', url: 'https://www.apmseason.com' },
      { title: 'Jobright', description: 'Utilize AI to find job matches and streamline your job search process.', url: 'https://jobright.ai' }
    ]
  },
  {
    category: 'Additional Tools',
    items: [
      { title: 'Glassdoor', description: 'Read company reviews and about their culture.', url: 'https://www.glassdoor.com' },
      { title: 'Levels.fyi', description: 'Get insights on salary levels. These tend to be pretty accurate!', url: 'https://www.levels.fyi' }
    ]
  }
];

const ResourcesPage = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(['Resume & Interview Guides']);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const isCategoryOpen = (category: string) => openCategories.includes(category);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PM <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Access valuable resources to help you excel in your product management journey.
            </p>
          </div>
        </AnimatedSection>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {resources.map((category, categoryIndex) => (
            <AnimatedSection 
              key={categoryIndex} 
              animation="slide-up" 
              delay={categoryIndex * 100}
            >
              <Collapsible 
                open={isCategoryOpen(category.category)} 
                onOpenChange={() => toggleCategory(category.category)}
                className="border border-border rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mr-4">
                      {categoryIndex === 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75m0 0h15m0 0v-8.25a2.25 2.25 0 0 0-.75-1.5h-1.376c.35.854.535 1.07.66 1.3.057.102.05.254-.055.354l-1.213 1.212a.25.25 0 0 1-.354 0l-1.213-1.212a.25.25 0 0 1-.055-.357.5.5 0 0 0-.115-.285A10.975 10.975 0 0 1 18 6.75c0-.071 0-.143-.004-.215A14.903 14.903 0 0 1 15 5.25" />
                        </svg>
                      )}
                      {categoryIndex === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      )}
                      {categoryIndex === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                        </svg>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold">{category.category}</h2>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className={`w-5 h-5 transition-transform ${isCategoryOpen(category.category) ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="bg-muted/50 border border-border hover:bg-muted/70 transition-colors">
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1 text-card-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <a 
                            href={item.url} 
                            className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center"
                          >
                            View Resource
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;

import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const RecruitingPage = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(['Step 1: Build Your Resume']);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  const isCategoryOpen = (category: string) => openCategories.includes(category);

  const steps = [
    { title: 'Step 1: Build Your Resume', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>PRO TIP: Make sure each line in your resume goes all the way across the page. It ensures your resume looks clean, professional, and easy to read</li>
          <li>Each bullet point should be a powerful one liner. A recruiter should be able to pull PM skills from any line on your resume</li>
          <li>Tailor your resume to "PM skills" - showcase creative projects, being a leader, passion for building, and customer obsession.</li>
          <li>Focus on quantifiable achievements - if it's with a business, what IMPACT did you have.</li>
          <li>Use action verbs.</li>
          <li>Showcase technical skills and AI knowledge.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">ResumeGenius</h3>
              <p className="text-sm text-muted-foreground">Access professional resume templates and tips.</p>
              <a href="https://www.resumegenius.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit ResumeGenius</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Vmock</h3>
              <p className="text-sm text-muted-foreground">Get instant feedback on your resume with Vmock.</p>
              <a href="https://www.vmock.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Vmock</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">IGotAnOffer</h3>
              <p className="text-sm text-muted-foreground">Learn how to craft a standout product manager resume.</p>
              <a href="https://igotanoffer.com/blogs/product-manager/product-manager-resume" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit IGotAnOffer</a>
            </CardContent>
          </Card>
        </div>
      </>
    )},
    { title: 'Step 2: Perfect your LinkedIn', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>LinkedIn is how you show recruiters and companies your personality. They will be looking at your skills, but also want to know if you are a "cultural fit".</li>
          <li>Be involved - make posts, share updates, and comment on other's posts to increase visibility.</li>
          <li>Follow people and companies you are interested in - you will learn a lot from what they post.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">LinkedIn's Official Guide</h3>
              <p className="text-sm text-muted-foreground">Explore LinkedIn's tips and best practices for optimizing your profile.</p>
              <a href="https://www.linkedin.com/help/linkedin/answer/4443" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit LinkedIn Guide</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">HubSpot's LinkedIn Tips</h3>
              <p className="text-sm text-muted-foreground">Learn how to optimize your LinkedIn profile with HubSpot's comprehensive guide.</p>
              <a href="https://blog.hubspot.com/marketing/linkedin-profile-tips" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit HubSpot Guide</a>
            </CardContent>
          </Card>
        </div>
      </>
    )},
    { title: 'Step 3: Pick Your Top 10 Companies', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>You want to have a list of companies that you are interested in and can prepare for in advance to get referrals and apply to job openeings.</li>
          <li>Explore company websites and news articles.</li>
          <li>Consider locations of their headquarters, company reviews, and salary insights.</li>
          <li>Ensure it is a company or product that you are excited about.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Glassdoor</h3>
              <p className="text-sm text-muted-foreground">Read company reviews and about their culture.</p>
              <a href="https://www.glassdoor.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Glassdoor</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Levels.fyi</h3>
              <p className="text-sm text-muted-foreground">Get insights on salary levels. These tend to be pretty acurate!</p>
              <a href="https://www.levels.fyi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Levels.fyi</a>
            </CardContent>
          </Card>
        </div>
      </>
    )},
    { title: 'Step 4: Informational Interviews with Industry Professionals', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Now take the time to connect with BYU alumni, or others and conduct informational interviews.</li>
          <li>Get to know them, their company, what sort of projects they are working on, company culture, and any other questions you have.</li>
          <li>Make it friendly and get to know them as well.</li>
          <li>Ask if they would be willing to give you a referral when a job application opens up that you are interested in.</li>
          <li>Get an insider view of how to stand out as an applicant, what talents or passions does the company care about, and how you should stay informed on when they drop new job applications.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Coffee Chat Guide</h3>
              <p className="text-sm text-muted-foreground">Learn how to conduct effective coffee chats and informational interviews.</p>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Coffee Chat Guide</a>
            </CardContent>
          </Card>
        </div>
      </>
    )},
    { title: 'Step 5: Finding and Applying for Open Positions', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Use job search engines and company career pages to find open positions.</li>
          <li>Most company career pages you can set alerts for when positions with your criteria open up.</li>
          <li>Customize your resume and cover letter for each application.</li>
          <li>Try and ask for a referral before you apply.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">NewGrad Jobs</h3>
              <p className="text-sm text-muted-foreground">Explore entry-level job opportunities for new graduates.</p>
              <a href="https://www.newgrad-jobs.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit NewGrad Jobs</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Intern List</h3>
              <p className="text-sm text-muted-foreground">Find internships and entry-level positions across various industries.</p>
              <a href="https://www.intern-list.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Intern List</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Jobright</h3>
              <p className="text-sm text-muted-foreground">Utilize AI to find job matches and streamline your job search process.</p>
              <a href="https://jobright.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Jobright</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">LinkedIn Jobs</h3>
              <p className="text-sm text-muted-foreground">Find job openings and connect with recruiters on LinkedIn.</p>
              <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit LinkedIn Jobs</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">APM Season</h3>
              <p className="text-sm text-muted-foreground">Stay up-to-date on the latest APM programs and internships for aspiring product managers.</p>
              <a href="https://www.apmseason.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit APM Season</a>
            </CardContent>
          </Card>
        </div>
      </>
    )},
    { title: 'Step 6: Interview Prep', content: (
      <>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Practice practice practice.</li>
          <li>Find common interview questions and write out stories that you can use to answer those questions. Keep it concise.</li>
          <li>Find a friend or use a tool to practice at least once a week.</li>
        </ul>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">Slack</h3>
              <p className="text-sm text-muted-foreground">This is Product Haven. A slack channel full of aspiring PMs looking to interview prep and sharing job listings.</p>
              <a href="https://producthaven.slack.com/archives/C05SRL7THV2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Product Haven</a>
            </CardContent>
          </Card>
          <Card className="bg-card/80 border border-border rounded-md h-full">
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-card-foreground">PMF Labs</h3>
              <p className="text-sm text-muted-foreground">Use AI tools to practice and improve your interview skills.</p>
              <a href="https://www.pmflabs.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit PMF Labs</a>
            </CardContent>
          </Card>
        </div>
      </>
    )}
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div className="relative bg-gradient-to-b from-primary/10 via-secondary/5 to-background" style={{ height: '35vh' }}>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="neon-lines">
            <div className="line line1"></div>
            <div className="line line2"></div>
            <div className="line line3"></div>
            <div className="line line4"></div>
          </div>
          <h1 className="relative text-5xl font-bold mb-2 text-center text-foreground z-10">Recruiting Guide</h1>
        </div>
      </div>

      <style>{`
        .neon-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .line {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, #4299E1, transparent);
          animation: pulse 2s infinite;
        }
        .line1 { left: 25%; transform: rotate(45deg); }
        .line2 { right: 25%; transform: rotate(-45deg); }
        .line3 { left: 50%; transform: rotate(135deg); }
        .line4 { right: 50%; transform: rotate(-135deg); }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {steps.map((step, index) => (
          <Collapsible key={index} open={isCategoryOpen(step.title)} onOpenChange={() => toggleCategory(step.title)} className="border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mr-4">
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 0 0 2.25 2.25h.75m0 0h15m0 0v-8.25a2.25 2.25 0 0 0-.75-1.5h-1.376c.35.854.535 1.07.66 1.3.057.102.05.254-.055.354l-1.213 1.212a.25.25 0 0 1-.354 0l-1.213-1.212a.25.25 0 0 1-.055-.357.5.5 0 0 0-.115-.285A10.975 10.975 0 0 1 18 6.75c0-.071 0-.143-.004-.215A14.903 14.903 0 0 1 15 5.25" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className={`w-5 h-5 transition-transform ${isCategoryOpen(step.title) ? 'rotate-180' : ''}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-0">
                {step.content}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default RecruitingPage; 
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';


// Recruiting Timeline data
const recruitingMilestones = [
  {
    title: "Join BYU PMA & Attend Kickoff",
    description: "Get involved early, meet peers, and learn about PM opportunities.",
  },
  {
    title: "Build a PM Resume",
    description: "Highlight leadership, teamwork, and analytical skills relevant to product roles.",
  },
  {
    title: "Network & Attend Events",
    description: "Connect with recruiters, alumni, and attend PM workshops or panels.",
  },
  {
    title: "Mock Interviews & Refine Pitch",
    description: "Practice behavioral and case interviews, and get feedback from mentors.",
  },
  {
    title: "Apply to Internships (Aug–Oct)",
    description: "Submit tailored applications and track deadlines for top companies.",
  },
  {
    title: "Follow Up & Learn from Rejections",
    description: "Send thank-yous, ask for feedback, and keep improving your approach.",
  },
];

// Airtable configuration (using same config as EventsPage)
const AIRTABLE_API_KEY = 'pat32NdNyEvz1lH3s.a777c3f877a0b354eabf7e503872efd7ad4ecd0567e6d4c60d4cc6d56e219499';
const AIRTABLE_BASE_ID = 'app8MiB9XxERjKDqC';
const EVENTS_TABLE_ID = 'tblsZMV8hbA285Lay'; // Using the actual working table ID from EventsPage

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status?: string;
}

const HomePage = () => {
  const [showEventBanner, setShowEventBanner] = useState(false);
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [apiError, setApiError] = useState(false);

  // Fallback event for when API fails
  const fallbackEvent: Event = {
    id: 'fallback',
    title: 'PMA Workshop Series',
    description: 'Join us for our PM Workshop Series - Learn from industry experts',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
    location: 'BYU Campus',
    status: 'upcoming'
  };

  // Fetch upcoming events from Airtable
  const fetchUpcomingEvents = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      setApiError(false);
      
      // Get events that are upcoming (date >= today)
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${EVENTS_TABLE_ID}`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.records && data.records.length > 0) {
          // Transform Airtable data to our Event format (same as EventsPage)
          const transformedEvents = data.records.map((record: any) => ({
            id: record.id,
            title: record.fields.title || '',
            date: record.fields.date || '',
            description: record.fields.description || '',
            location: record.fields.location || '',
            status: record.fields.status || 'upcoming'
          }));
          
          // Find the next upcoming event
          const now = new Date();
          const upcomingEvents = transformedEvents
            .filter((event: Event) => new Date(event.date) >= now)
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          if (upcomingEvents.length > 0) {
            setUpcomingEvent(upcomingEvents[0]);
          } else {
            // No upcoming events found, use fallback
            setUpcomingEvent(fallbackEvent);
          }
        } else {
          // No events found, use fallback
          setUpcomingEvent(fallbackEvent);
        }
      } else {
        // API error (403, 404, etc.), use fallback
        console.warn(`Airtable API error: ${response.status} ${response.statusText}`);
        setUpcomingEvent(fallbackEvent);
        setApiError(true);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Network error, use fallback
      setUpcomingEvent(fallbackEvent);
      setApiError(true);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [AIRTABLE_BASE_ID, EVENTS_TABLE_ID, AIRTABLE_API_KEY]);

  // Show event banner after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEventBanner(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch events on component mount
  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#4299E1]/10 dark:bg-[#4299E1]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#215096]/10 dark:bg-[#215096]/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 z-10 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedSection animation="fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  BYU Product Management <span className="text-gradient">Association</span>
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in" delay={300}>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-6">
                  Empowering the next generation of product leaders through hands-on experience, industry connections, and community.
                </p>
              </AnimatedSection>
              
              <AnimatedSection animation="fade-in" delay={600}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://clubs.byu.edu/p/clubview/18295873486206095" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#215096] to-[#4299E1] rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Join BYU PMA
                  </a>
                  <Link to="/team" className="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                    Meet Our Team
                  </Link>
                </div>
              </AnimatedSection>
            </div>
            
            <AnimatedSection animation="slide-up" className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-64 rounded-xl bg-gradient-to-br from-[#215096]/20 to-[#4299E1]/20 border border-gray-200 dark:border-white/10 p-1">
                    <div className="h-full w-full rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/img/Home1.png" 
                        alt="BYU PMA Event" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="h-40 rounded-xl bg-gradient-to-br from-[#4299E1]/20 to-[#215096]/20 border border-gray-200 dark:border-white/10 p-1">
                    <div className="h-full w-full rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/img/Home2.png" 
                        alt="BYU PMA Workshop" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-40 rounded-xl bg-gradient-to-br from-[#215096]/20 to-[#4299E1]/20 border border-gray-200 dark:border-white/10 p-1">
                    <div className="h-full w-full rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/img/Home3.png" 
                        alt="BYU PMA Networking" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-[#4299E1]/20 to-[#215096]/20 border border-gray-200 dark:border-white/10 p-1">
                    <div className="h-full w-full rounded-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden">
                      <img 
                        src="/img/Home4.png" 
                        alt="BYU PMA Team" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Company Logo Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="overflow-hidden">
            <div 
              className="flex space-x-8 animate-scroll items-center hover:overflow-x-auto hover:animate-none"
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.preventDefault();
                  const container = e.currentTarget;
                  container.scrollLeft += e.deltaY;
                }
              }}
            >
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  
                  
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/amazon-logo.jpg" alt="Amazon" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/salesforce-logo.png" alt="Salesforce" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/lucid-logo.jpg" alt="Lucid Software" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/databricks-logo.png" alt="Databricks" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/domo-logo.png" alt="Domo" className="h-full w-full object-cover" /> 
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/microsoft-logo.jpg" alt="Microsoft" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/podium-logo.png" alt="Podium" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/dell-logo.png" alt="Dell" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/google-logo.png" alt="Google" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/adobe-logo.png" alt="Adobe" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/qualtrics-logo.png" alt="Qualtrics" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/walmart-logo.png" alt="Walmart" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/weave-logo.jpg" alt="Weave" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/capitalone-logo.png" alt="Capital One" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/goldman-logo.png" alt="Goldman Sachs" className="h-full w-full object-cover" />
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/disney-logo.jpg" alt="Disney" className="h-full w-full object-cover" /> 
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/brevium-logo.png" alt="Brevium" className="h-full w-full object-cover" /> 
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/pattern-logo.png" alt="Pattern" className="h-full w-full object-cover" /> 
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/entrata-logo.png" alt="Entrata" className="h-full w-full object-cover" /> 
                  </div>
                  <div className="h-24 w-48 bg-gray-700/20 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                    <img src="/img/awardco-logo.png" alt="Awardco" className="h-full w-full object-cover" /> 
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }
      `}</style>

      {/* About Section */}
      <section id="about" className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-gradient">BYU PMA</span></h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The Product Management Association at Brigham Young University is dedicated to helping students develop the skills necessary to excel in the world of product management.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={100}>
              <Card className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Community</h3>
                  <p className="text-gray-600 dark:text-gray-400">Join a network of like-minded students passionate about product management and technology.</p>
                </CardContent>
              </Card>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={200}>
              <Card className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Education</h3>
                  <p className="text-gray-600 dark:text-gray-400">Access workshops, guest speakers, and resources to develop essential product management skills.</p>
                </CardContent>
              </Card>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={300}>
              <Card className="bg-white/80 dark:bg-black/40 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Industry Access</h3>
                  <p className="text-gray-600 dark:text-gray-400">Connect with product leaders and companies for internships, job opportunities, and mentorship.</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* New to Product Management Section */}
          <AnimatedSection animation="slide-up" delay={400}>
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">New to Product Management or want to learn more?</h2>
              <a 
                href="/discover" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#215096] to-[#4299E1] rounded-xl text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Discover PM
              </a>
            </div>
          </AnimatedSection>

        </div>
      </section>
      
      {/* Club Impact Section
      <section className="py-32 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1A365D]/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Club <span className="text-gradient">Impact</span></h2>
              <p className="text-lg text-gray-300">
                See how BYU PMA is making a difference in students' careers and professional development.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatedSection animation="slide-up" delay={100} className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6 h-full">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#4A90E2]/30 to-[#87CEEB]/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-4xl font-bold text-white mb-2">85%</h3>
                    <p className="text-gray-300">of active members secured PM internships</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#87CEEB]/30 to-[#4A90E2]/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-4xl font-bold text-white mb-2">40+</h3>
                    <p className="text-gray-300">workshop sessions per year</p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="bg-gradient-to-br from-[#4A90E2]/30 to-[#87CEEB]/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-4xl font-bold text-white mb-2">25+</h3>
                    <p className="text-gray-300">companies recruited from our pool</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#87CEEB]/30 to-[#4A90E2]/30 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                    <h3 className="text-4xl font-bold text-white mb-2">120+</h3>
                    <p className="text-gray-300">active club members</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={200} className="order-1 lg:order-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Networking & Recruitment</h3>
                  <p className="text-gray-300">
                    We connect students with leading tech companies and product organizations through networking events, career fairs, and exclusive recruiting sessions.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Skill Development</h3>
                  <p className="text-gray-300">
                    Our workshops, case competitions, and hands-on projects help members develop critical PM skills like user research, roadmapping, and stakeholder management.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Resume & Interview Prep</h3>
                  <p className="text-gray-300">
                    Members receive personalized resume reviews, mock interviews, and practical advice from industry professionals to stand out in competitive PM roles.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section> */}
      
      {/* Recruiting Timeline Section (Framer Motion) */}
      {/* <RecruitingTimeline /> */}

      {/* Testimonials Section
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Member <span className="text-gradient">Testimonials</span></h2>
              <p className="text-lg text-gray-300">
                Hear from our members about their experiences with BYU PMA.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection animation="slide-up" delay={100}>
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <svg className="w-10 h-10 text-[#4A90E2] mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8c-2.209 0-4 1.791-4 4v10c0 2.209 1.791 4 4 4h12c2.209 0 4-1.791 4-4v-10c0-2.209-1.791-4-4-4h-12zM10 10h12c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2h-12c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2zM23.691 10.691c-0.292-0.292-0.767-0.292-1.059 0s-0.292 0.767 0 1.059c0.292 0.292 0.767 0.292 1.059 0s0.292-0.767 0-1.059zM17 12c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zM17 14c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2z" />
                  </svg>
                  <p className="text-gray-300 mb-6">"Joining BYU PMA was the best decision I made in college. The networking opportunities and case competitions prepared me for my PM internship at Microsoft."</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB]"></div>
                    <div className="ml-4">
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-gray-400">Class of 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={200}>
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <svg className="w-10 h-10 text-[#4A90E2] mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8c-2.209 0-4 1.791-4 4v10c0 2.209 1.791 4 4 4h12c2.209 0 4-1.791 4-4v-10c0-2.209-1.791-4-4-4h-12zM10 10h12c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2h-12c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2zM23.691 10.691c-0.292-0.292-0.767-0.292-1.059 0s-0.292 0.767 0 1.059c0.292 0.292 0.767 0.292 1.059 0s0.292-0.767 0-1.059zM17 12c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zM17 14c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2z" />
                  </svg>
                  <p className="text-gray-300 mb-6">"The resume workshops and mock interviews gave me the confidence to land my dream PM role. The community is supportive and the connections are invaluable."</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB]"></div>
                    <div className="ml-4">
                      <p className="font-medium">David Chen</p>
                      <p className="text-sm text-gray-400">Class of 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-up" delay={300}>
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <svg className="w-10 h-10 text-[#4A90E2] mb-4" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 8c-2.209 0-4 1.791-4 4v10c0 2.209 1.791 4 4 4h12c2.209 0 4-1.791 4-4v-10c0-2.209-1.791-4-4-4h-12zM10 10h12c1.105 0 2 0.895 2 2v10c0 1.105-0.895 2-2 2h-12c-1.105 0-2-0.895-2-2v-10c0-1.105 0.895-2 2-2zM23.691 10.691c-0.292-0.292-0.767-0.292-1.059 0s-0.292 0.767 0 1.059c0.292 0.292 0.767 0.292 1.059 0s0.292-0.767 0-1.059zM17 12c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zM17 14c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2z" />
                  </svg>
                  <p className="text-gray-300 mb-6">"As someone with a technical background, BYU PMA helped me bridge the gap to product management. The mentorship and hands-on projects were game-changers."</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#4A90E2] to-[#87CEEB]"></div>
                    <div className="ml-4">
                      <p className="font-medium">Emma Rodriguez</p>
                      <p className="text-sm text-gray-400">Class of 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section> */}
      
      {/* Event Banner */}
      <AnimatePresence>
        {showEventBanner && upcomingEvent && !isLoadingEvents && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl"
          >
            <div className="bg-gradient-to-r from-[#215096] to-[#4299E1] rounded-lg shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      🎉 {upcomingEvent.title}
                      {apiError && <span className="text-xs text-blue-200 ml-2">(Demo Event)</span>}
                    </h3>
                    <p className="text-blue-100 text-sm">{upcomingEvent.description}</p>
                    <p className="text-blue-200 text-xs mt-1">
                      📅 {new Date(upcomingEvent.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} | 📍 {upcomingEvent.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/events"
                    className="px-4 py-2 bg-white text-[#215096] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors"
                  >
                    Learn More
                  </Link>
                  <button
                    onClick={() => setShowEventBanner(false)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Dismiss banner"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function RecruitingTimeline() {
  const containerRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  // Combine refs for both intersection observer and container
  function setRefs(node: HTMLElement | null) {
    containerRef.current = node;
    inViewRef(node);
  }

  useEffect(() => {
    if (inView && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [inView]);

  return (
    <section
      ref={setRefs}
      className="relative w-full flex flex-col items-center justify-center bg-gradient-to-b from-black via-[#181824] to-[#232336]"
    >
      <div className="w-full max-w-xl z-20 sticky top-0 pt-4 pb-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
          Recruiting <span className="text-gradient">Timeline</span>
        </h2>
        <p className="text-lg text-gray-300 mb-0 font-medium"></p>
      </div>
      <div className="relative w-full max-w-xl flex flex-col items-center">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#4A90E2] to-[#87CEEB] rounded-full opacity-40" />
        {recruitingMilestones.map((milestone) => (
          <Milestone
            key={milestone.title}
            milestone={milestone}
          />
        ))}
      </div>
    </section>
  );
}

function Milestone({ milestone }: { milestone: { title: string; description: string } }) {
  const { ref, inView } = useInView({
    threshold: 0.6,
    triggerOnce: false,
  });

  return (
    <div
      ref={ref}
      className="relative flex items-center min-h-[60vh] snap-center"
      style={{ zIndex: 2 }}
    >
      {/* Dot/Icon */}
      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-[#4A90E2] to-[#87CEEB] flex items-center justify-center text-white text-lg shadow-lg border-2 border-white/10">
      </span>
      {/* Content */}
      <AnimatePresence>
        {inView && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="ml-16 bg-black/70 border border-white/10 rounded-xl p-8 shadow-xl max-w-md"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{milestone.title}</h3>
            <p className="text-gray-300 text-base">{milestone.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;

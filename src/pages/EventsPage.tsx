import { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  status?: string;
  img?: string; // URL to image/flyer attachment
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlyer, setSelectedFlyer] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://api.airtable.com/v0/app8MiB9XxERjKDqC/tblsZMV8hbA285Lay', {
          headers: {
            'Authorization': 'Bearer pat32NdNyEvz1lH3s.a777c3f877a0b354eabf7e503872efd7ad4ecd0567e6d4c60d4cc6d56e219499',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform Airtable data to our Event format
        const transformedEvents = data.records.map((record: any) => ({
          id: record.id,
          title: record.fields.title || '',
          date: record.fields.date || '',
          description: record.fields.description || '',
          location: record.fields.location || '',
          status: record.fields.status || 'upcoming',
          img: record.fields.img?.[0]?.url || '' // Get first attachment URL from img field
        }));

        setEvents(transformedEvents);
      } catch (err) {
        console.error('Error fetching events data:', err);
        setError('Failed to load events data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, []);

  // Format date nicely
  // const formatDate = (dateString: string) => {
  //   const options: Intl.DateTimeFormatOptions = { 
  //     weekday: 'long', 
  //     year: 'numeric', 
  //     month: 'long', 
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   };
  //   return new Date(dateString).toLocaleDateString('en-US', options);
  // };

  // Generate Google Calendar URL
  const generateCalendarUrl = (event: Event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
      details: event.description,
      location: event.location,
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Filter and sort events
  const getFilteredEvents = () => {
    const now = new Date();
    
    if (filter === 'past') {
      // Past events: most recent to oldest
      return events
        .filter(event => new Date(event.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      // Upcoming events: soonest to latest
      return events
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Upcoming <span className="text-gradient">Events</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join us for workshops, speakers, and networking opportunities.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 gap-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 p-6 bg-gradient-to-br from-[#215096]/30 to-[#4299E1]/30">
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Upcoming <span className="text-gradient">Events</span>
              </h1>
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                <p className="text-red-300">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upcoming <span className="text-gradient">Events</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us for workshops, speakers, and networking opportunities.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="slide-up" delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-card/50 rounded-lg p-1 backdrop-blur-sm">
              <button 
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'upcoming'
                    ? 'bg-gradient-to-r from-[#215096] to-[#4299E1] text-white'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'past'
                    ? 'bg-gradient-to-r from-[#215096] to-[#4299E1] text-white'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                Past
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-1 gap-6">
              {getFilteredEvents().map((event, index) => (
                <AnimatedSection key={event.id} animation="fade-in" delay={index * 100}>
                  <Card className="bg-card/80 border border-border backdrop-blur-sm hover:bg-card/90 transition-all">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Date Section */}
                        <div className="md:w-48 p-6 bg-gradient-to-br from-[#215096]/30 to-[#4299E1]/30 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                          <div className="text-lg font-semibold mb-1">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
                          <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        
                        {/* Event Details */}
                        <div className="flex-1 p-6">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            {event.location}
                          </div>
                          <a
                            href={generateCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#215096] to-[#4299E1] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            Add to Calendar
                          </a>
                        </div>
                        
                        {/* Event Image/Attachment - Right Side */}
                        <div className="md:w-64 p-6 flex items-center justify-center">
                          {event.img ? (
                            <div className="w-full h-48 md:h-40">
                              <img 
                                src={event.img} 
                                alt={event.title}
                                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                                onClick={() => setSelectedFlyer(event.img!)}
                              />
                            </div>
                          ) : (
                            <div className="text-muted-foreground text-sm text-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-1 opacity-50">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              <div>No attachment</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
          
          <AnimatedSection animation="fade-in" delay={400}>
            <div className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">Have an event suggestion?</h3>
                  <p className="text-muted-foreground">We'd love to hear your ideas for future events and workshops!</p>
                </div>
                <button className="mt-4 md:mt-0 inline-flex items-center justify-center px-6 py-3 bg-transparent border border-border rounded-lg text-foreground font-medium hover:bg-muted/50 transition-all">
                  Submit Idea
                </button>
              </div>
            </div>
          </AnimatedSection>
        </AnimatedSection>
      </div>
      
      {/* Flyer Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold">Event Attachment</h3>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
              {selectedFlyer.endsWith('.pdf') ? (
                <iframe
                  src={selectedFlyer}
                  className="w-full h-full border-0"
                  title="Event Attachment PDF"
                />
              ) : (
                <img
                  src={selectedFlyer}
                  alt="Event Attachment"
                  className="w-full h-auto max-h-full object-contain mx-auto"
                />
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
              <a
                href={selectedFlyer}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-[#215096] to-[#4299E1] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => setSelectedFlyer(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

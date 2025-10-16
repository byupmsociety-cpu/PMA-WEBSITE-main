import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
}

const TeamPage = () => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://api.airtable.com/v0/app8MiB9XxERjKDqC/tblRtMfdCG6kRbsux', {
          headers: {
            'Authorization': 'Bearer pat32NdNyEvz1lH3s.a777c3f877a0b354eabf7e503872efd7ad4ecd0567e6d4c60d4cc6d56e219499',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Transform Airtable data to our TeamMember format
        const transformedTeam = data.records.map((record: any) => {
          // Handle Airtable attachment field for images
          let imageUrl = '';
          if (record.fields.img && record.fields.img.length > 0) {
            // Airtable stores images as attachment objects
            imageUrl = record.fields.img[0].url;
          }
          
          return {
            id: record.id,
            name: record.fields.name || '',
            role: record.fields.role || '',
            bio: record.fields.bio || '',
            image: imageUrl,
            email: record.fields.email || '',
            linkedin: record.fields.linkedin || ''
          };
        });

        setTeam(transformedTeam);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const toggleCard = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our <span className="text-gradient">Team</span>
              </h1>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-[520px] animate-pulse">
                <div className="h-60 bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
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
      <div className="min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection animation="slide-up">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Meet Our <span className="text-gradient">Team</span>
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
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg text-gray-300">
            </p>
          </div>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={member.id}>
              <div 
                className="relative h-[520px] cursor-pointer perspective-1000"
                onClick={() => toggleCard(index)}
              >
                <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
                  flippedCards.includes(index) ? 'rotate-y-180' : ''
                }`}>
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-full flex flex-col">
                      <div className="h-60 relative">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.currentTarget.src = '/img/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto">
                        <h3 className="text-lg font-bold">{member.name}</h3>
                        <p className="text-gradient text-sm font-medium mb-2">{member.role}</p>
                        <div className="text-gray-300 text-sm whitespace-pre-line">{member.bio}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180">
                    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm h-full p-4 flex flex-col">
                      <h3 className="text-lg font-bold mb-4">{member.name}</h3>
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {member.email && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${member.email}`} className="text-sm text-gray-300 hover:text-white">
                              {member.email}
                            </a>
                          </div>
                        )}
                        {member.linkedin && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            <a href={`https://${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-white">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;

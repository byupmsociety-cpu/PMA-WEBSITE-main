import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { pmSkills, pmJargon, dailyChallenges } from './quizConstants';

export const WhatIsPM = () => (
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
);

export const WhyPMSection = () => (
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Work-Life Balance</h3>
                <p className="text-muted-foreground">Flexible schedules and remote work options that let you maintain a healthy lifestyle</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Impactful Projects</h3>
                <p className="text-muted-foreground">Work on exciting products that directly impact business growth and user experience</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#215096] to-[#4299E1] flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
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
);

export const KeySkillsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4 md:px-6">
      <AnimatedSection animation="slide-up">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Key Skills for <span className="text-gradient">Success</span></h2>
          <p className="text-lg text-muted-foreground">Advice from Expert PMs and BYU Almuni</p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatedSection animation="slide-up" delay={100}>
          <div className="bg-card/80 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground">Technical Skills</h3>
            <ul className="space-y-4">
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Data Analysis & Metrics</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Coding experience (or at least an understanding)</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">AI Prototyping / Prompt Engineering</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">User Research</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Competitive Analysis</span></li>
            </ul>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="slide-up" delay={200}>
          <div className="bg-card/80 border border-border rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-card-foreground">Soft Skills</h3>
            <ul className="space-y-4">
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Communication (concise and able to collaborate among multiple teams)</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Leadership (be a leader without "authority")</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Problem Solving</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Bias for Action</span></li>
              <li className="flex items-start"><span className="text-primary mr-2">•</span><span className="text-muted-foreground">Always curious</span></li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export const PMSkillGenerator = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<typeof pmSkills[0] | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const randomRotation = 1800 + Math.random() * 1800;
    setRotation(r => r + randomRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const selectedIndex = Math.floor(Math.random() * pmSkills.length);
      setSelectedSkill(pmSkills[selectedIndex]);
    }, 3000);
  };

  return (
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
          <div className="text-center space-y-4 max-w-sm">
            <h4 className="text-xl font-bold text-card-foreground">{selectedSkill.name}</h4>
            <p className="text-muted-foreground text-sm">{selectedSkill.description}</p>
            <div className="space-y-2">
              <a href={selectedSkill.learnMore} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                Learn More
              </a>
              <p className="text-muted-foreground text-sm">{selectedSkill.activity}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PMJargonQuiz = () => {
  const [score, setScore] = useState(0);
  const [quizTerm, setQuizTerm] = useState<typeof pmJargon[0] | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);

  const startNewQuiz = () => {
    const randomIndex = Math.floor(Math.random() * pmJargon.length);
    setQuizTerm(pmJargon[randomIndex]);
    setShowDefinition(false);
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleGuess = (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);
    setShowDefinition(true);
  };

  return (
    <div className="bg-card/80 border border-border rounded-xl p-8">
      <h3 className="text-2xl font-bold mb-6 text-card-foreground">PM Jargon Quiz</h3>
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xl mb-2">Score: {score}</p>
          <p className="text-2xl font-bold mb-4">{quizTerm?.term}</p>
          {showDefinition ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">{quizTerm?.definition}</p>
              <Button onClick={startNewQuiz} className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md">
                Next Term
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Do you know what this means?</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => handleGuess(true)} className="bg-green-500 hover:bg-green-600 text-white">Yes</Button>
                <Button onClick={() => handleGuess(false)} className="bg-red-500 hover:bg-red-600 text-white">No</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PMDailyChallenge = () => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showExample, setShowExample] = useState(false);

  const handleNextChallenge = () => {
    setCurrentChallenge(prev => (prev + 1) % dailyChallenges.length);
    setUserInput('');
    setShowExample(false);
  };

  return (
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
          <Button onClick={() => setShowExample(!showExample)} variant="outline" className="border-border hover:bg-muted">
            {showExample ? 'Hide Example' : 'Show Example'}
          </Button>
          <Button onClick={handleNextChallenge} className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md">
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
  );
};

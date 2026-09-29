import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { pmSkills, pmJargon, dailyChallenges } from './quizConstants';

export const WhatIsPM = () => (
  <section id="what-is-pm" className="py-20 bg-muted/20">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <AnimatedSection animation="slide-up" delay={100}>
          <PMVennDiagram />
        </AnimatedSection>
        <AnimatedSection animation="slide-up" delay={200}>
          <div className="space-y-6">
            {vennAreas.map((area) => (
              <div key={area.label} className="flex items-start gap-4">
                <span
                  className="mt-1.5 h-4 w-4 rounded-full shrink-0 border-2"
                  style={{ backgroundColor: `hsl(var(${area.token}) / 0.2)`, borderColor: `hsl(var(${area.token}))` }}
                />
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {area.label} <span className="text-muted-foreground font-medium text-base">· {area.question}</span>
                  </h3>
                  <p className="text-muted-foreground">{area.description}</p>
                </div>
              </div>
            ))}
            <p className="text-card-foreground font-medium pt-2 border-t border-border">
              The PM sits in the middle, making sure what gets built is valuable, buildable, and wanted.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

const vennAreas = [
  {
    label: 'Business',
    token: '--primary',
    question: 'Is it viable?',
    description: "Does it support the company's strategy, reach a real market, and make (or save) money?",
  },
  {
    label: 'Technology',
    token: '--secondary',
    question: 'Is it feasible?',
    description: 'Can the team build it well with the time, tools, and people they have?',
  },
  {
    label: 'Customer',
    token: '--accent',
    question: 'Is it desirable?',
    description: 'Does it solve a real problem that people care about enough to use?',
  },
];

// Business / Technology / Customer overlap, with the PM in the middle.
const PMVennDiagram = () => {
  const r = 110;
  const circles = [
    { label: 'Business', token: '--primary', cx: 140, cy: 140, lx: 105, ly: 112 },
    { label: 'Technology', token: '--secondary', cx: 260, cy: 140, lx: 295, ly: 112 },
    { label: 'Customer', token: '--accent', cx: 200, cy: 244, lx: 200, ly: 305 },
  ];
  return (
    <svg
      viewBox="0 0 400 370"
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Venn diagram: product management sits where business, technology, and customer overlap"
    >
      {circles.map((c) => (
        <circle
          key={c.label}
          cx={c.cx}
          cy={c.cy}
          r={r}
          fill={`hsl(var(${c.token}) / 0.14)`}
          stroke={`hsl(var(${c.token}))`}
          strokeWidth="2.5"
        />
      ))}
      {circles.map((c) => (
        <text
          key={c.label}
          x={c.lx}
          y={c.ly}
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="17"
          fontWeight="700"
        >
          {c.label}
        </text>
      ))}
      <circle cx="200" cy="176" r="32" fill="hsl(var(--primary))" />
      <text x="200" y="183" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="20" fontWeight="800">
        PM
      </text>
    </svg>
  );
};

const WHEEL_SIZE = 280;
const WHEEL_RADIUS = 130;
const SPIN_MS = 4000;
const segmentFills = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

// Point on the wheel, measured clockwise from 12 o'clock.
const polar = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180;
  const c = WHEEL_SIZE / 2;
  return { x: c + radius * Math.sin(rad), y: c - radius * Math.cos(rad) };
};

export const PMSkillGenerator = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState<typeof pmSkills[0] | null>(null);

  const segment = 360 / pmSkills.length;
  const c = WHEEL_SIZE / 2;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSkill(null);

    // Pick the winner first, then rotate so its slice stops under the pointer.
    const index = Math.floor(Math.random() * pmSkills.length);
    const jitter = (Math.random() - 0.5) * segment * 0.6;
    const target = (360 - ((index + 0.5) * segment + jitter) + 360) % 360;
    const delta = (target - (rotation % 360) + 360) % 360;
    setRotation(r => r + 360 * 5 + delta);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedSkill(pmSkills[index]);
    }, SPIN_MS);
  };

  return (
    <div className="bg-card/80 border border-border rounded-xl p-8">
      <h3 className="text-2xl font-bold mb-2 text-card-foreground">PM Skill Generator</h3>
      <p className="text-muted-foreground mb-6">Spin to get a PM skill and a small way to practice it this week.</p>
      <div className="flex flex-col items-center space-y-6">
        <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
          {/* Pointer */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 -top-2 z-10 drop-shadow"
            width="28"
            height="32"
            viewBox="0 0 28 32"
            aria-hidden="true"
          >
            <path d="M14 32 L2 6 A12 12 0 0 1 26 6 Z" fill="hsl(var(--foreground))" />
            <circle cx="14" cy="10" r="4" fill="hsl(var(--background))" />
          </svg>

          <svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            role="img"
            aria-label="PM skill wheel"
            className="drop-shadow-lg"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.85, 0.25, 1)` : 'none',
            }}
          >
            <circle cx={c} cy={c} r={WHEEL_RADIUS + 6} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
            {pmSkills.map((skill, i) => {
              const start = polar(i * segment, WHEEL_RADIUS);
              const end = polar((i + 1) * segment, WHEEL_RADIUS);
              const largeArc = segment > 180 ? 1 : 0;
              const words = skill.name.split(' ');
              return (
                <g key={skill.name}>
                  <path
                    d={`M ${c} ${c} L ${start.x} ${start.y} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
                    fill={segmentFills[i % segmentFills.length]}
                    stroke="hsl(var(--card))"
                    strokeWidth="2"
                  />
                  <g transform={`rotate(${(i + 0.5) * segment} ${c} ${c})`}>
                    <text
                      x={c}
                      y={c - WHEEL_RADIUS * 0.66}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {words.map((word, w) => (
                        <tspan key={w} x={c} dy={w === 0 ? (words.length > 1 ? -6 : 4) : 14}>
                          {word}
                        </tspan>
                      ))}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Hub (doesn't rotate) */}
          <button
            type="button"
            onClick={spinWheel}
            disabled={isSpinning}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-primary text-primary text-sm font-bold shadow-md hover:scale-105 transition-transform disabled:hover:scale-100"
          >
            SPIN
          </button>
        </div>

        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="bg-gradient-to-r from-primary to-secondary !text-white drop-shadow-md"
        >
          {isSpinning ? 'Spinning...' : selectedSkill ? 'Spin Again' : 'Spin the Wheel'}
        </Button>

        <div className="w-full min-h-[9rem]" aria-live="polite">
          {selectedSkill && (
            <div className="bg-muted/50 border border-border rounded-lg p-5 space-y-3">
              <h4 className="text-xl font-bold text-card-foreground">{selectedSkill.name}</h4>
              <p className="text-muted-foreground text-sm">{selectedSkill.description}</p>
              <p className="text-sm">
                <span className="font-semibold text-card-foreground">Try this: </span>
                <span className="text-muted-foreground">{selectedSkill.activity}</span>
              </p>
              {!selectedSkill.learnMore.includes('example') && (
                <a href={selectedSkill.learnMore} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm inline-block">
                  Learn more →
                </a>
              )}
            </div>
          )}
        </div>
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
              <Button onClick={startNewQuiz} className="bg-gradient-to-r from-primary to-secondary !text-white drop-shadow-md">
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
          <Button onClick={handleNextChallenge} className="bg-gradient-to-r from-primary to-secondary !text-white drop-shadow-md">
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

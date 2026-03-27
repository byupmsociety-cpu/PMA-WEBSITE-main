import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Crown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  QuizAnswers,
  Roadmap,
  YearInSchool,
  ExperienceLevel,
  InternshipType,
  InterestArea,
  SkillFocus,
  majors,
  interestAreas,
  skillFocuses,
  generateRoadmap
} from './quizConstants';

const PMQuizDialog = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isPmaMember = profile?.is_pma_member ?? false;

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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mapExperienceLevel = (level: number): string => {
    if (level <= 2) return 'none';
    if (level <= 4) return 'beginner';
    if (level <= 7) return 'intermediate';
    return 'advanced';
  };

  const saveRoadmapToDatabase = async (generatedRoadmap: Roadmap) => {
    if (!user || !isPmaMember) return;
    
    setSaving(true);
    
    const payload = {
      user_id: user.id,
      school_year: answers.yearInSchool,
      major: answers.major,
      coding_experience: mapExperienceLevel(answers.experience.coding),
      design_experience: mapExperienceLevel(answers.experience.design),
      business_experience: mapExperienceLevel(answers.experience.businessStrategy),
      pm_experience: mapExperienceLevel(answers.experience.productManagement),
      has_internship: answers.internship !== 'None',
      interest_areas: answers.interests,
      skill_focus: answers.skillFocus,
      generated_roadmap: {
        academics: generatedRoadmap.major,
        classes: generatedRoadmap.classes,
        clubs: generatedRoadmap.clubs,
        projects: generatedRoadmap.projects,
        internships: generatedRoadmap.internships,
        skills: generatedRoadmap.skills,
        tools: generatedRoadmap.tools,
        events: generatedRoadmap.events,
        alumni: generatedRoadmap.alumniConnections,
      },
    };

    const { error } = await supabase
      .from("roadmap_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("Error saving roadmap:", error);
      toast({
        title: "Error saving roadmap",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSaved(true);
      toast({
        title: "Roadmap saved!",
        description: "View your personalized roadmap anytime from your dashboard.",
      });
    }
    setSaving(false);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      const generatedRoadmap = generateRoadmap(answers);
      setRoadmap(generatedRoadmap);
      if (user && isPmaMember) {
        saveRoadmapToDatabase(generatedRoadmap);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
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
                <div className="flex justify-between text-sm text-muted-foreground">
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
                    className="rounded border-border"
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
                    className="rounded border-border"
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-2xl font-bold">Your Personalized PM Roadmap</h3>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm">
              Export CSV
            </Button>
            {isPmaMember && saved && (
              <Button asChild size="sm" className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white">
                <Link to="/roadmap">View Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Save status for PMA members */}
        {user && isPmaMember && (
          <div className={`p-3 rounded-lg text-sm ${saved ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving your roadmap...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Roadmap saved! Track your progress in the Roadmap Dashboard.
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Your roadmap will be saved automatically.
              </span>
            )}
          </div>
        )}
        
        {user && !isPmaMember && (
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 text-sm">
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Join PMA to save your roadmap and track your progress over time!
            </span>
          </div>
        )}
        
        {!user && (
          <div className="p-3 rounded-lg bg-muted text-muted-foreground text-sm">
            <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to save your roadmap and track progress.
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Academic Path</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.major.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Recommended Classes</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.classes.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-card-foreground">Clubs & Organizations</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {roadmap.clubs.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Project Ideas</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.projects.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Internship Opportunities</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.internships.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Skills to Develop</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.skills.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Tools to Learn</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.tools.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">PMA Events to Attend</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.events.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-3 text-foreground">Alumni Connections</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              {roadmap.alumniConnections.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
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
                  className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white drop-shadow-md ml-auto"
                >
                  {currentStep === 6 ? 'Get Results' : 'Next'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DiscoverHero = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden" style={{ minWidth: '100vw', minHeight: '100vh' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-125 transition-transform duration-700"
        preload="auto"
      >
        <source src="https://res.cloudinary.com/ddscxev8c/video/upload/v1747668238/qj6v0ltaqnrty0pwtozw.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative h-full w-full flex items-center justify-center text-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Discover Your <span className="text-gradient">Product Management</span> Path
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            ↓ Build your BYU-customized path to a Product Management Career ↓
          </p>
          <div className="space-y-4">
            <PMQuizDialog />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverHero;

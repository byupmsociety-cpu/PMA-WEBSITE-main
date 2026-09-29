import { WhatIsPM } from '@/components/discover/DiscoverContent';
import { StudentsHero, PathsIntoPM, StudentFAQ } from '@/components/students/StudentsContent';

const StudentsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero (the PM quiz in DiscoverHero is parked for now) */}
      <StudentsHero />

      {/* What is PM Section */}
      <WhatIsPM />

      {/* Majors & classes that lead to PM */}
      <PathsIntoPM />

      {/* FAQ */}
      <StudentFAQ />

      {/* Games section (skill wheel, jargon quiz, daily challenge) is hidden for now.
          The components still live in components/discover/DiscoverContent.tsx. */}
    </div>
  );
};

export default StudentsPage;

import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';

const DataPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              BYU PMA <span className="text-gradient">Data</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {/* Removed text for simplicity */}
            </p>
          </div>
        </AnimatedSection>
        
        <div className="bg-card/80 border border-border rounded-lg p-6 backdrop-blur-sm">
          <AnimatedSection animation="fade-in">
            <p className="text-center mb-8 text-muted-foreground">
              This dashboard provides a quick overview of real BYU placement data
            </p>
            <div className="aspect-[16/9] w-4/5 mx-auto bg-card/60 border border-border rounded-lg overflow-hidden flex items-center justify-center mb-8">
              <img src="/img/data.png" alt="Data Visualization" className="object-cover" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default DataPage;

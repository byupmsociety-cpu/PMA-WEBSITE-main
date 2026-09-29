import {
  CompaniesHero,
  EngagementOptions,
  CompaniesCTA
} from '@/components/companies/CompaniesContent';

const CompaniesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <CompaniesHero />

      {/* Ways to Engage Section */}
      <EngagementOptions />

      {/* Contact CTA Section */}
      <CompaniesCTA />
    </div>
  );
};

export default CompaniesPage;

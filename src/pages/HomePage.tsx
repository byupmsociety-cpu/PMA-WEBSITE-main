import HomeHero from "@/components/home/HomeHero";
import AboutSection from "@/components/home/AboutSection";
import CompanyLogoCarousel from "@/components/home/CompanyLogoCarousel";
import ClubPrograms from "@/components/home/ClubPrograms";
import UpcomingEvents from "@/components/home/UpcomingEvents";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <AboutSection />
      <CompanyLogoCarousel />
      <ClubPrograms />
      <UpcomingEvents />
    </div>
  );
};

export default HomePage;

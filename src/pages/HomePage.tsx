import HomeHero from "@/components/home/HomeHero";
import CompanyLogoCarousel from "@/components/home/CompanyLogoCarousel";
import AboutSection from "@/components/home/AboutSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Testimonials from "@/components/home/Testimonials";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <CompanyLogoCarousel />
      <AboutSection />
      <UpcomingEvents />
      <Testimonials />
    </div>
  );
};

export default HomePage;

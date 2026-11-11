import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Sits below the fixed 64px navigation bar, so it needs the top padding
const CaseNightBanner = () => {
  return (
    <div className="pt-16 relative z-20">
      <Link
        to="/events/case-interview"
        className="group block bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center text-sm md:text-base">
          <span className="font-semibold">Here for tonight's PMA activity? Start here.</span>
          <span className="inline-flex items-center gap-1 underline underline-offset-4">
            Case Interview: Build the Fix with AI
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CaseNightBanner;

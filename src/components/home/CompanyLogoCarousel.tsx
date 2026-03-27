import React, { useRef, useEffect } from "react";

const CompanyLogoCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="overflow-hidden">
          <div
            ref={carouselRef}
            className="flex space-x-8 animate-scroll items-center hover:overflow-x-auto hover-scroll-pause"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="contents">
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/amazon-logo.jpg" alt="Amazon" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/salesforce-logo.png" alt="Salesforce" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/lucid-logo.jpg" alt="Lucid Software" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/databricks-logo.png" alt="Databricks" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/domo-logo.png" alt="Domo" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/microsoft-logo.jpg" alt="Microsoft" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/podium-logo.png" alt="Podium" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/dell-logo.png" alt="Dell" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/google-logo.png" alt="Google" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/adobe-logo.png" alt="Adobe" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/qualtrics-logo.png" alt="Qualtrics" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/walmart-logo.png" alt="Walmart" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/weave-logo.jpg" alt="Weave" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/capitalone-logo.png" alt="Capital One" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/goldman-logo.png" alt="Goldman Sachs" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/disney-logo.jpg" alt="Disney" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/brevium-logo.png" alt="Brevium" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/pattern-logo.png" alt="Pattern" className="h-full w-full object-cover" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/entrata-logo.png" alt="Entrata" className="h-full w-full object-contain" />
                </div>
                <div className="h-24 w-48 bg-muted/50 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-2">
                  <img src="/img/awardco-logo.png" alt="Awardco" className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogoCarousel;

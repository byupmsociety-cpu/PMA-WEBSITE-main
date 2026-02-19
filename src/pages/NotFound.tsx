import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Hackathon", path: "/hackathon" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-2">
            <span className="text-gradient">404</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Page not found</p>
          <p className="text-sm text-muted-foreground mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Return to Home
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">or</span>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Quick links">
              {quickLinks
                .filter(({ path }) => path !== "/")
                .map(({ label, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    {label}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

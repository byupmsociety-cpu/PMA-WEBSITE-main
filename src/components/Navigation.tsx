import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isGuest, loading: authLoading } = useAuth();
  const showGuestBanner = location.pathname === '/dashboard' && isGuest && !authLoading;

  // Handle scroll behavior to hide/show navbar (disabled when mobile menu is open)
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) return; // Keep header visible while menu is open
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, mobileMenuOpen]);

  // Set active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Close mobile menu when clicking on a link
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
  };

  const links: { name: string; path: string; featured?: boolean }[] = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'Discover PM', path: '/discover' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
    <header
      className={`fixed w-full z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="backdrop-blur-lg bg-white/90 dark:bg-black/40 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img
                src="/img/pma-logo-transparent.png"
                alt="PMA Logo"
                className="h-24 w-24"
              />
            </Link>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {links.map((link) => (
                  <li key={link.path}>
                    {link.featured ? (
                      <Link
                        to={link.path}
                        className={`relative px-4 py-2 text-sm font-bold transition-all duration-300
                        border-2 rounded-full border-blue-500 text-blue-600 dark:text-blue-400
                        hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-950/20
                        ${activeLink === link.path
                          ? 'ring-2 ring-blue-500/50 bg-blue-50 dark:bg-blue-950/20 border-blue-600 dark:border-blue-400'
                          : 'animate-pulse-slow'}`}
                        onClick={() => setActiveLink(link.path)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <Link
                        to={link.path}
                        className={`relative px-1 py-2 text-sm font-medium transition-colors
                        ${activeLink === link.path ? 'text-primary dark:text-white' : 'text-muted-foreground hover:text-primary'}
                        after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0
                        after:bg-gradient-to-r after:from-primary after:to-secondary after:origin-bottom-right
                        after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left
                        ${activeLink === link.path ? 'after:scale-x-100' : ''}`}
                        onClick={() => setActiveLink(link.path)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-2">
              <button
                className="md:hidden text-foreground p-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sheet - overlay panel, portal-rendered, body scroll locked */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="z-[60] w-[85%] max-w-sm flex flex-col p-0"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <div className="flex flex-col h-full">
            <nav className="flex-1 overflow-y-auto p-6 pt-14">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    {link.featured ? (
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 text-base font-bold rounded-md transition-all
                        border-2 border-blue-500 text-blue-600 dark:text-blue-400
                        hover:bg-blue-50 dark:hover:bg-blue-950/20
                        ${activeLink === link.path
                          ? 'ring-2 ring-blue-500/50 bg-blue-50 dark:bg-blue-950/20 border-blue-600 dark:border-blue-400'
                          : 'animate-pulse-slow'}`}
                        onClick={() => handleLinkClick(link.path)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                          activeLink === link.path
                            ? 'text-primary dark:text-white bg-blue-50 dark:bg-blue-900/20'
                            : 'text-muted-foreground hover:text-primary hover:bg-muted'
                        }`}
                        onClick={() => handleLinkClick(link.path)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>

    {/* Guest banner: fixed at top when header hidden, sits below header when visible */}
    {showGuestBanner && (
      <div
        className={`fixed left-0 right-0 z-40 border-b border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 shadow-sm transition-all duration-300 ${
          visible ? 'top-16' : 'top-0'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center gap-2">
          <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-100">
            You're using a free account. Become a PMA member to unlock job alerts, personalized roadmaps, member directory, and all premium features.
          </p>
        </div>
      </div>
    )}
    </>
  );
};

export default Navigation;

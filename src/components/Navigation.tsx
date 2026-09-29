import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, LogIn, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { signOutAndReload } from '@/lib/signOut';

const Navigation = () => {
  const location = useLocation();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, isAdmin, isSuperAdmin, isBlocked, loading: authLoading } = useAuth();
  const isPmaMember = !!profile?.is_pma_member && !isBlocked;
  const showAdminLink = (isAdmin || isSuperAdmin) && !isBlocked;

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

  const links: { name: string; path: string; featured?: boolean; locked?: boolean }[] = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources', locked: !authLoading && !isPmaMember },
    { name: 'For Students', path: '/students' },
    { name: 'For Companies', path: '/companies' },
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
                        <span className="inline-flex items-center gap-1">
                          {link.name}
                          {link.locked && <Lock className="h-3 w-3" aria-label="Members only" />}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center space-x-2">
              {!authLoading && (
                <div className="hidden md:flex items-center gap-2">
                  {showAdminLink && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  {user ? (
                    <button
                      onClick={signOutAndReload}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      Member login
                    </Link>
                  )}
                </div>
              )}
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
                        <span className="inline-flex items-center gap-2">
                          {link.name}
                          {link.locked && <Lock className="h-4 w-4" aria-label="Members only" />}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {!authLoading && (
              <div className="border-t border-border p-6 space-y-2">
                {showAdminLink && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-base font-medium rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOutAndReload(); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-base font-medium rounded-md border border-border text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Member login
                  </Link>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>

    </>
  );
};

export default Navigation;

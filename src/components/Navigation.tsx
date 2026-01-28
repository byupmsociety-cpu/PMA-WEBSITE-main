import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import AuthModal from './AuthModal';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  
  // Handle scroll behavior to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  // Set active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Check auth status and load profile
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setFirstName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();
    
    if (data?.full_name) {
      const name = data.full_name.split(' ')[0];
      setFirstName(name);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setFirstName('');
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Hackathon', path: '/hackathon', featured: true },
    { name: 'Events', path: '/events' },
    { name: 'Resources', path: '/resources' },
    { name: 'Discover PM', path: '/discover' },
    { name: 'Contact', path: '/contact' }
  ];
  
  return (
    <header 
      className={`fixed w-full z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="backdrop-blur-lg bg-white/90 dark:bg-black/40 border-b border-gray-200 dark:border-white/10 shadow-sm">
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
                        ${activeLink === link.path ? 'text-primary dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'}
                        after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0
                        after:bg-gradient-to-r after:from-[#215096] after:to-[#4299E1] after:origin-bottom-right
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
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {firstName ? firstName[0].toUpperCase() : <UserCircle className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <span>{firstName || 'Profile'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  size="sm"
                  className="hidden md:flex gap-2"
                >
                  <UserCircle className="h-4 w-4" />
                  Sign In
                </Button>
              )}
              <button
                className="md:hidden text-gray-700 dark:text-white p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          
          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <nav className="py-4 border-t border-gray-200 dark:border-white/10">
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
                            : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                        onClick={() => handleLinkClick(link.path)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-3 text-base font-medium rounded-md transition-colors text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="block w-full text-left px-4 py-3 text-base font-medium rounded-md transition-colors text-primary dark:text-white bg-blue-50 dark:bg-blue-900/20"
                    >
                      Sign In
                    </button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

export default Navigation;

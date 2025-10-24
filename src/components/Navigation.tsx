import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [activeLink, setActiveLink] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    setActiveLink(window.location.pathname);
  }, []);

  // Close mobile menu when clicking on a link
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    setMobileMenuOpen(false);
  };
  
  const links = [
    { name: 'Home', path: '/' },
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
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
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
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

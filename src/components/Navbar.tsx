import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, setReturnTo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleAuthClick = (path: string) => {
    setReturnTo(location.pathname);
    navigate(path);
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled ? 'bg-background/95 backdrop-blur-sm shadow-sm' : 'bg-background'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="https://postimg.cc/R6YDHY8G" alt="NABS Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-foreground">NABS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/courses" className="text-foreground hover:text-foreground/80">
              Courses
            </Link>
            <Link to="/about" className="text-foreground hover:text-foreground/80">
              About
            </Link>
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-foreground/80">
                  Dashboard
                </Link>
                <Button onClick={handleSignOut} variant="ghost">
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => handleAuthClick('/sign-in')}>
                  Sign In
                </Button>
                <Button onClick={() => handleAuthClick('/sign-up')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-foreground/80 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/courses"
                className="block px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleAuthClick('/sign-in');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick('/sign-up');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:text-foreground/80"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
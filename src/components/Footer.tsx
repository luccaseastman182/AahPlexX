import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic would go here
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-info" />
              <span className="ml-2 text-xl font-bold text-foreground">NABS</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Advancing careers through professional certifications and continuous learning.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and special offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-grow"
                />
                <Button type="submit">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Social */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Connect With Us
            </h3>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} National Academy of Business Sciences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
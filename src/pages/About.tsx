import React from 'react';
import { usePageTitle } from '@/lib/hooks';
import { Building2, Users, Trophy, BookOpen } from 'lucide-react';

export default function About() {
  usePageTitle('About Us');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About NABS
          </h1>
          <p className="text-xl text-muted-foreground">
            The National Academy of Business Sciences is dedicated to advancing professional excellence through comprehensive certification programs.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To provide accessible, industry-leading business education and certification programs that empower professionals to advance their careers and make meaningful contributions to their organizations.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the premier global institution for business certification, recognized for excellence in professional development and practical business education.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <Building2 className="h-12 w-12 text-info mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Founded</h3>
            <p className="text-muted-foreground">2020</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <Users className="h-12 w-12 text-info mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Students</h3>
            <p className="text-muted-foreground">10,000+</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <Trophy className="h-12 w-12 text-info mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Certifications</h3>
            <p className="text-muted-foreground">15+</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md text-center">
            <BookOpen className="h-12 w-12 text-info mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Course Hours</h3>
            <p className="text-muted-foreground">1,000+</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-foreground mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We maintain the highest standards in education and certification to ensure our students receive quality training.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously update our programs to reflect the latest industry trends and best practices.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-foreground mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We make professional education accessible through flexible, self-paced learning options.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-foreground mb-2">Integrity</h3>
              <p className="text-muted-foreground">
                We uphold the highest ethical standards in all our educational practices and business operations.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
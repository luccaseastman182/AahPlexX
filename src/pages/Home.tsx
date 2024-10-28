import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            National Academy of Business Sciences
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Advance your career with our self-paced professional certifications
          </p>
          <Link
            to="/courses"
            className="inline-block bg-info text-info-foreground px-6 py-3 rounded-lg hover:bg-info/90 transition-colors"
          >
            Explore Our Certifications
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <BookOpen className="h-8 w-8 text-info mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Self-Paced Learning</h3>
            <p className="text-muted-foreground">
              Study at your own pace and fit certification programs into your busy schedule.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <Award className="h-8 w-8 text-info mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Industry-Relevant Content</h3>
            <p className="text-muted-foreground">
              Our certifications are designed to meet current industry standards and practices.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md">
            <Users className="h-8 w-8 text-info mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Professional Development</h3>
            <p className="text-muted-foreground">
              Enhance your skills and boost your resume with recognized certifications.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
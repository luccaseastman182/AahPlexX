import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CourseCard } from '@/components/course/CourseCard';
import { usePageTitle } from '@/lib/hooks';
import { Course } from '@/lib/types/course';
import { loadCourses } from '@/lib/course-loader';
import { useQuery } from '@tanstack/react-query';

export default function Courses() {
  usePageTitle('Available Certifications - NABS');

  const { 
    data: courses = [], 
    isLoading, 
    error 
  } = useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: loadCourses,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-label="Loading courses"
      >
        <Loader2 className="h-8 w-8 animate-spin text-info" aria-hidden="true" />
        <span className="sr-only">Loading courses...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div 
            className="text-center text-error"
            role="alert"
            aria-live="polite"
          >
            <h1 className="text-2xl font-bold mb-4">Error Loading Courses</h1>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Available Certifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Advance your career with our professional certification programs
          </p>
        </header>

        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Available courses"
        >
          {courses.map((course) => (
            <div key={course.id} role="listitem">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <p 
            className="text-center text-muted-foreground"
            role="status"
          >
            No courses are currently available. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/lib/types/course';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <article 
      className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      aria-labelledby={`course-title-${course.id}`}
    >
      <BookOpen className="h-8 w-8 text-info mb-4" aria-hidden="true" />
      <h2 
        id={`course-title-${course.id}`}
        className="text-xl font-bold text-foreground mb-2"
      >
        {course.title}
      </h2>
      <p className="text-muted-foreground mb-4">{course.description}</p>
      
      {course.level && (
        <div className="mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Level: {course.level}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-foreground">
          ${course.price}
        </span>
        <Button
          onClick={() => navigate(`/courses/${course.id}`)}
          className="bg-info text-info-foreground hover:bg-info/90"
          aria-label={`Enroll in ${course.title}`}
        >
          Enroll Now
        </Button>
      </div>
    </article>
  );
}
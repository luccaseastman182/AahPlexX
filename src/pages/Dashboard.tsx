import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { usePageTitle } from '@/lib/hooks';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastAccessed: string;
  modules: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

export default function Dashboard() {
  usePageTitle('Student Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const response = await api.get('/api/user/courses');
        setCourses(response.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <BookOpen className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Active Courses</h3>
              <p className="text-3xl font-bold text-foreground">{courses.length}</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <Clock className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-foreground">
                {courses.reduce((acc, course) => acc + (course.modules.length * 2), 0)}
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <Award className="h-8 w-8 text-info mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Certifications</h3>
              <p className="text-3xl font-bold text-foreground">
                {courses.filter(course => 
                  course.modules.every(module => module.completed)
                ).length}
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Courses</h2>
            {courses.length === 0 ? (
              <div className="bg-card p-8 rounded-lg shadow-md text-center">
                <BookOpen className="h-12 w-12 text-info mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No courses yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Button onClick={() => navigate('/courses')}>
                  Browse Courses
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-card rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {course.description}
                      </p>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span>{Math.round(course.progress)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-info h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="w-full"
                      >
                        Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="px-6 py-4 bg-muted border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getCourseContent, getUserCourseProgress, updateLessonProgress } from '@/lib/course';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { ModuleSidebar } from '@/components/course/ModuleSidebar';
import { LessonContent } from '@/components/course/LessonContent';
import { QuizSection } from '@/components/course/QuizSection';
import { AssignmentSection } from '@/components/course/AssignmentSection';
import { ResourceSection } from '@/components/course/ResourceSection';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface CourseState {
  content: any;
  progress: any;
  currentModule: any;
  currentLesson: any;
}

export default function CourseModule() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [state, setState] = useState<CourseState>({
    content: null,
    progress: null,
    currentModule: null,
    currentLesson: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      if (!courseId) return;

      try {
        const [courseContent, courseProgress] = await Promise.all([
          getCourseContent(courseId),
          getUserCourseProgress(courseId)
        ]);

        if (!courseContent || !courseProgress) {
          throw new Error('Failed to load course content');
        }

        const currentModule = moduleId 
          ? courseContent.modules.find(m => m.id === moduleId)
          : courseContent.modules[0];

        const currentLesson = currentModule && (lessonId
          ? currentModule.lessons.find(l => l.id === lessonId)
          : currentModule.lessons[0]);

        setState({
          content: courseContent,
          progress: courseProgress,
          currentModule,
          currentLesson
        });
      } catch (err) {
        setError('You do not have access to this course content');
        console.error('Error loading course module:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [courseId, moduleId, lessonId, user]);

  const handleLessonComplete = async () => {
    if (!courseId || !state.currentModule?.id || !state.currentLesson?.id) return;

    try {
      const success = await updateLessonProgress(
        courseId,
        state.currentModule.id,
        state.currentLesson.id,
        { completed: true }
      );

      if (success) {
        // Navigate to next lesson or module
        const currentModuleIndex = state.content.modules.findIndex(
          m => m.id === state.currentModule.id
        );
        const currentLessonIndex = state.currentModule.lessons.findIndex(
          l => l.id === state.currentLesson.id
        );

        if (currentLessonIndex < state.currentModule.lessons.length - 1) {
          // Next lesson in current module
          const nextLesson = state.currentModule.lessons[currentLessonIndex + 1];
          navigate(`/courses/${courseId}/modules/${state.currentModule.id}/lessons/${nextLesson.id}`);
        } else if (currentModuleIndex < state.content.modules.length - 1) {
          // First lesson of next module
          const nextModule = state.content.modules[currentModuleIndex + 1];
          navigate(`/courses/${courseId}/modules/${nextModule.id}/lessons/${nextModule.lessons[0].id}`);
        }
      }
    } catch (err) {
      console.error('Error updating lesson progress:', err);
    }
  };

  const calculateProgress = () => {
    if (!state.progress?.progress) return 0;
    const totalLessons = state.content.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );
    const completedLessons = state.progress.progress.filter(p => p.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <Button
          onClick={() => navigate('/courses')}
          className="mt-4"
        >
          Return to Courses
        </Button>
      </div>
    );
  }

  if (!state.content || !state.currentModule || !state.currentLesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="Course content not found" />
        <Button
          onClick={() => navigate('/courses')}
          className="mt-4"
        >
          Return to Courses
        </Button>
      </div>
    );
  }

  const courseProgress = calculateProgress();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <ModuleSidebar
            modules={state.content.modules}
            currentModule={state.currentModule}
            currentLesson={state.currentLesson}
            progress={state.progress}
            courseId={courseId}
          />

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Course Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Course Progress</h2>
                  <span className="text-sm text-muted-foreground">{courseProgress}% Complete</span>
                </div>
                <Progress value={courseProgress} className="h-2" />
              </div>

              {/* Module Navigation */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{state.currentModule.title}</h1>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/courses')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Course Overview
                  </Button>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="bg-card rounded-lg shadow-lg p-8">
                <LessonContent
                  lesson={state.currentLesson}
                  onComplete={handleLessonComplete}
                />

                {state.currentLesson.quiz && (
                  <QuizSection
                    quiz={state.currentLesson.quiz}
                    lessonId={state.currentLesson.id}
                    courseId={courseId!}
                    moduleId={state.currentModule.id}
                  />
                )}

                {state.currentLesson.assignment && (
                  <AssignmentSection
                    assignment={state.currentLesson.assignment}
                    lessonId={state.currentLesson.id}
                    courseId={courseId!}
                    moduleId={state.currentModule.id}
                  />
                )}

                {state.currentLesson.resources && (
                  <ResourceSection
                    resources={state.currentLesson.resources}
                  />
                )}
              </div>

              {/* Lesson Navigation */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => {/* Navigate to previous lesson */}}
                  disabled={/* Check if first lesson */}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Lesson
                </Button>
                <Button
                  onClick={() => {/* Navigate to next lesson */}}
                  disabled={/* Check if last lesson */}
                >
                  Next Lesson
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
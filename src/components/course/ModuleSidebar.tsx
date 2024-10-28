import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface ModuleSidebarProps {
  modules: any[];
  currentModule: any;
  currentLesson: any;
  progress: any;
  courseId: string;
}

export function ModuleSidebar({
  modules,
  currentModule,
  currentLesson,
  progress,
  courseId
}: ModuleSidebarProps) {
  const navigate = useNavigate();

  const isLessonCompleted = (moduleId: string, lessonId: string) => {
    return progress?.progress?.some(
      (p: any) => p.moduleId === moduleId && p.lessonId === lessonId && p.completed
    );
  };

  const isModuleAccessible = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    
    const previousModule = modules[moduleIndex - 1];
    return previousModule.lessons.every((lesson: any) =>
      isLessonCompleted(previousModule.id, lesson.id)
    );
  };

  return (
    <div className="w-80 bg-card border-r border-border h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Course Modules</h2>
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center gap-2">
                {isModuleAccessible(moduleIndex) ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                <h3 className="font-medium">{module.title}</h3>
              </div>
              <div className="ml-6 space-y-1">
                {module.lessons.map((lesson: any) => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                    className={cn(
                      'block py-2 px-4 rounded-lg text-sm',
                      currentLesson.id === lesson.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent',
                      !isModuleAccessible(moduleIndex) && 'opacity-50 pointer-events-none'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {isLessonCompleted(module.id, lesson.id) ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Circle className="h-3 w-3" />
                      )}
                      {lesson.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
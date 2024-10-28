import { parse } from 'yaml';
import { useAuth } from './auth';
import { IdGenerator } from './id-generator';

// Update interfaces with strict ID types
interface CoursePreview {
  id: string;
  title: string;
  summary: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  prerequisites: string[];
  objectives: string[];
  highlights: string[];
  thumbnail: string;
  preview_modules: {
    title: string;
    description: string;
  }[];
}

interface CourseModule {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
    content_path: string;
    duration: number;
    quiz?: {
      id: string;
      questions: {
        id: string;
        question: string;
        options: string[];
        correct: number;
      }[];
    };
    assignment?: {
      id: string;
      title: string;
      description: string;
      submission_type: string;
      deadline_days: number;
    };
    resources?: {
      id: string;
      title: string;
      type: string;
      path: string;
    }[];
  }[];
}

interface CourseContent {
  id: string;
  modules: CourseModule[];
}

interface CourseAccess {
  id: string;
  courseId: string;
  userId: string;
  purchaseDate: Date;
  expiryDate: Date;
  progress: {
    moduleId: string;
    lessonId: string;
    completed: boolean;
    quizScore?: number;
    assignmentSubmitted?: boolean;
  }[];
}

// Add validation functions
export function validateCourseId(id: string): boolean {
  return IdGenerator.validateId(id);
}

export function validateModuleId(id: string): boolean {
  return IdGenerator.validateId(id);
}

export function validateLessonId(id: string): boolean {
  return IdGenerator.validateId(id);
}

// Update existing functions with ID validation
export async function getCoursePreview(courseId: string): Promise<CoursePreview | null> {
  if (!validateCourseId(courseId)) {
    console.error('Invalid course ID format:', courseId);
    return null;
  }

  try {
    const response = await fetch(`/api/courses/${courseId}/preview`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading course preview:', error);
    return null;
  }
}

export async function getCourseContent(courseId: string): Promise<CourseContent | null> {
  if (!validateCourseId(courseId)) {
    console.error('Invalid course ID format:', courseId);
    return null;
  }

  const { user } = useAuth();
  if (!user) return null;

  try {
    // Verify user has access to this course
    const accessResponse = await fetch(`/api/courses/${courseId}/access`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!accessResponse.ok) {
      throw new Error('User does not have access to this course');
    }

    const response = await fetch(`/api/courses/${courseId}/content`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (!response.ok) return null;
    const content = await response.json();

    // Validate all IDs in the content
    if (!validateCourseStructure(content)) {
      throw new Error('Invalid course content structure');
    }

    return content;
  } catch (error) {
    console.error('Error loading course content:', error);
    return null;
  }
}

// Add new validation function for course structure
function validateCourseStructure(content: CourseContent): boolean {
  try {
    if (!validateCourseId(content.id)) return false;

    return content.modules.every(module => {
      if (!validateModuleId(module.id)) return false;

      return module.lessons.every(lesson => {
        if (!validateLessonId(lesson.id)) return false;

        // Validate quiz IDs if present
        if (lesson.quiz && !IdGenerator.validateId(lesson.quiz.id)) return false;

        // Validate assignment IDs if present
        if (lesson.assignment && !IdGenerator.validateId(lesson.assignment.id)) return false;

        // Validate resource IDs if present
        if (lesson.resources) {
          return lesson.resources.every(resource => 
            IdGenerator.validateId(resource.id)
          );
        }

        return true;
      });
    });
  } catch {
    return false;
  }
}

// Rest of the file remains the same...
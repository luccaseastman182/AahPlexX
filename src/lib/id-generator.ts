import { customAlphabet } from 'nanoid';

// Create custom ID generators with specific alphabets and lengths
const createCourseId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 10);
const createModuleId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 12);
const createLessonId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 14);
const createQuizId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 16);
const createAssignmentId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 16);
const createResourceId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 16);
const createSubmissionId = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZ', 18);

export interface IdComponents {
  courseType: string;    // e.g., 'bms', 'dmp', etc.
  entityType: string;    // e.g., 'course', 'module', 'lesson'
  sequence: number;      // Sequential number within the type
}

export class IdGenerator {
  private static validateCourseType(courseType: string): boolean {
    return /^[a-z]{2,5}$/.test(courseType);
  }

  private static validateEntityType(entityType: string): boolean {
    const validTypes = ['course', 'module', 'lesson', 'quiz', 'assignment', 'resource'];
    return validTypes.includes(entityType);
  }

  private static formatSequence(num: number, width: number): string {
    return num.toString().padStart(width, '0');
  }

  static generateCourseId(courseType: string): string {
    if (!this.validateCourseType(courseType)) {
      throw new Error('Invalid course type format');
    }
    const uniqueId = createCourseId();
    return `${courseType}-${uniqueId}`;
  }

  static generateModuleId(courseId: string, sequence: number): string {
    const uniqueId = createModuleId();
    return `${courseId}-m${this.formatSequence(sequence, 3)}-${uniqueId}`;
  }

  static generateLessonId(moduleId: string, sequence: number): string {
    const uniqueId = createLessonId();
    return `${moduleId}-l${this.formatSequence(sequence, 3)}-${uniqueId}`;
  }

  static generateQuizId(lessonId: string): string {
    const uniqueId = createQuizId();
    return `${lessonId}-q-${uniqueId}`;
  }

  static generateAssignmentId(lessonId: string): string {
    const uniqueId = createAssignmentId();
    return `${lessonId}-a-${uniqueId}`;
  }

  static generateResourceId(lessonId: string, sequence: number): string {
    const uniqueId = createResourceId();
    return `${lessonId}-r${this.formatSequence(sequence, 3)}-${uniqueId}`;
  }

  static generateSubmissionId(assignmentId: string, userId: string): string {
    const uniqueId = createSubmissionId();
    return `sub-${assignmentId}-${userId}-${uniqueId}`;
  }

  static parseId(id: string): IdComponents | null {
    try {
      const parts = id.split('-');
      if (parts.length < 2) return null;

      return {
        courseType: parts[0],
        entityType: this.getEntityType(id),
        sequence: this.getSequence(id)
      };
    } catch {
      return null;
    }
  }

  private static getEntityType(id: string): string {
    if (id.includes('-m-')) return 'module';
    if (id.includes('-l-')) return 'lesson';
    if (id.includes('-q-')) return 'quiz';
    if (id.includes('-a-')) return 'assignment';
    if (id.includes('-r-')) return 'resource';
    return 'course';
  }

  private static getSequence(id: string): number {
    const match = id.match(/[ml](\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static validateId(id: string): boolean {
    try {
      const parts = id.split('-');
      if (parts.length < 2) return false;
      
      // Validate course type
      if (!this.validateCourseType(parts[0])) return false;

      // Validate format based on entity type
      if (id.includes('-m-')) {
        return /^[a-z]{2,5}-[A-Z0-9]{10}-m\d{3}-[A-Z0-9]{12}$/.test(id);
      } else if (id.includes('-l-')) {
        return /^[a-z]{2,5}-[A-Z0-9]{10}-m\d{3}-[A-Z0-9]{12}-l\d{3}-[A-Z0-9]{14}$/.test(id);
      }

      // Base course ID validation
      return /^[a-z]{2,5}-[A-Z0-9]{10}$/.test(id);
    } catch {
      return false;
    }
  }
}
import { Course, CoursesResponseSchema } from '@/lib/types/course';
import yaml from 'yaml';

const CACHE_KEY = 'courses-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: Course[];
  timestamp: number;
}

export async function loadCourses(): Promise<Course[]> {
  try {
    // Check cache first
    const cached = getCachedCourses();
    if (cached) return cached;

    const response = await fetch('/src/data/course-catalog/courses.yaml');
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = yaml.parse(text);
    
    // Validate data against schema
    const validated = CoursesResponseSchema.parse(parsed);
    
    // Cache the validated data
    cacheCourses(validated.courses);
    
    return validated.courses;
  } catch (error) {
    console.error('Error loading courses:', error);
    throw new Error('Failed to load courses. Please try again later.');
  }
}

function getCachedCourses(): Course[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp }: CacheEntry = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function cacheCourses(courses: Course[]): void {
  try {
    const cacheEntry: CacheEntry = {
      data: courses,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Failed to cache courses:', error);
  }
}
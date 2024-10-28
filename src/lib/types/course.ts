import { z } from "zod";

export const CourseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  duration: z.string().optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  prerequisites: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  highlights: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
  modules: z.number().optional(),
});

export type Course = z.infer<typeof CourseSchema>;

export const CoursesResponseSchema = z.object({
  courses: z.array(CourseSchema),
});

export type CoursesResponse = z.infer<typeof CoursesResponseSchema>;
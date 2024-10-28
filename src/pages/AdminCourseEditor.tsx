import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { IdGenerator } from '@/lib/id-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/Alert';
import { ModuleEditor } from '@/components/admin/ModuleEditor';
import { saveCourse } from '@/lib/admin';

interface CourseForm {
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
}

export default function AdminCourseEditor() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseForm>({
    title: '',
    summary: '',
    description: '',
    price: 0,
    duration: '',
    level: 'Intermediate',
    prerequisites: [],
    objectives: [],
    highlights: [],
    thumbnail: ''
  });
  const [modules, setModules] = useState<any[]>([]);

  // Ensure only admin access
  if (user?.role !== 'admin') {
    return <navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Generate course ID based on title
      const courseType = courseData.title
        .split(' ')
        .map(word => word[0].toLowerCase())
        .join('')
        .slice(0, 5);

      const courseId = IdGenerator.generateCourseId(courseType);

      const course = {
        id: courseId,
        ...courseData,
        modules: modules.map((module, moduleIndex) => ({
          id: IdGenerator.generateModuleId(courseId, moduleIndex + 1),
          ...module,
          lessons: module.lessons.map((lesson: any, lessonIndex: number) => ({
            id: IdGenerator.generateLessonId(module.id, lessonIndex + 1),
            ...lesson
          }))
        }))
      };

      await saveCourse(course);
      navigate('/admin/courses');
    } catch (err) {
      setError('Failed to save course. Please try again.');
      console.error('Error saving course:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course Title</label>
              <Input
                value={courseData.title}
                onChange={e => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              <Input
                value={courseData.summary}
                onChange={e => setCourseData(prev => ({ ...prev, summary: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={courseData.description}
                onChange={e => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <Input
                  type="number"
                  value={courseData.price}
                  onChange={e => setCourseData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <Input
                  value={courseData.duration}
                  onChange={e => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                  required
                  placeholder="e.g., 40 hours"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={courseData.level}
                onChange={e => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
              <Input
                value={courseData.thumbnail}
                onChange={e => setCourseData(prev => ({ ...prev, thumbnail: e.target.value }))}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <ModuleEditor
            modules={modules}
            setModules={setModules}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/courses')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
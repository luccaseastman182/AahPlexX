import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus } from 'lucide-react';

interface ModuleEditorProps {
  modules: any[];
  setModules: (modules: any[]) => void;
}

export function ModuleEditor({ modules, setModules }: ModuleEditorProps) {
  const addModule = () => {
    setModules([
      ...modules,
      {
        title: '',
        lessons: []
      }
    ]);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: '',
      content_path: '',
      duration: 45,
      quiz: null,
      assignment: null,
      resources: []
    });
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter(
      (_: any, i: number) => i !== lessonIndex
    );
    setModules(newModules);
  };

  const updateModule = (index: number, field: string, value: any) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: string, value: any) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Modules</h2>
        <Button type="button" onClick={addModule}>
          <Plus className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="border border-border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Module Title</label>
                <Input
                  value={module.title}
                  onChange={e => updateModule(moduleIndex, 'title', e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeModule(moduleIndex)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lessons</h3>
              <Button
                type="button"
                size="sm"
                onClick={() => addLesson(moduleIndex)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Lesson
              </Button>
            </div>

            {module.lessons.map((lesson: any, lessonIndex: number) => (
              <div key={lessonIndex} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Lesson Title</label>
                      <Input
                        value={lesson.title}
                        onChange={e => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Content Path</label>
                      <Input
                        value={lesson.content_path}
                        onChange={e => updateLesson(moduleIndex, lessonIndex, 'content_path', e.target.value)}
                        required
                        placeholder="/content/course/module/lesson.md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                      <Input
                        type="number"
                        value={lesson.duration}
                        onChange={e => updateLesson(moduleIndex, lessonIndex, 'duration', Number(e.target.value))}
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
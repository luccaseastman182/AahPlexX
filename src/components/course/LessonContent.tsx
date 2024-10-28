import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { marked } from 'marked';

interface LessonContentProps {
  lesson: any;
  onComplete: () => void;
}

export function LessonContent({ lesson, onComplete }: LessonContentProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(lesson.content_path);
        const text = await response.text();
        setContent(marked(text));
      } catch (error) {
        console.error('Error loading lesson content:', error);
        setContent('Failed to load lesson content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [lesson.content_path]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">{lesson.title}</h2>
      <div 
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex justify-end">
        <Button onClick={onComplete}>
          Complete Lesson
        </Button>
      </div>
    </div>
  );
}
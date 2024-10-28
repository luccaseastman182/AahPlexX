import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MarkdownEditor } from '@/components/admin/MarkdownEditor';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { saveCourseContent } from '@/lib/admin';
import { Save, Eye, Code, FileText } from 'lucide-react';

export default function AdminCourseContentEditor() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('edit');

  // Ensure only admin access
  if (user?.role !== 'admin') {
    return <navigate to="/" replace />;
  }

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch(
          `/api/admin/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/content`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );

        if (!response.ok) throw new Error('Failed to load content');
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Failed to load lesson content');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [courseId, moduleId, lessonId, user.token]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await saveCourseContent(courseId!, moduleId!, lessonId!, content);
    } catch (err) {
      setError('Failed to save content');
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Course Content Editor</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/courses')}
            >
              Back to Courses
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <LoadingSpinner className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {error && <Alert type="error" message={error} />}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="edit">
              <Code className="w-4 h-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="guide">
              <FileText className="w-4 h-4 mr-2" />
              Writing Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              className="min-h-[600px]"
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="prose prose-slate dark:prose-invert max-w-none bg-card p-8 rounded-lg">
              <MarkdownPreview content={content} />
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-slate dark:prose-invert max-w-none bg-card p-8 rounded-lg">
              <h2>Course Content Writing Guide</h2>
              <h3>Structure</h3>
              <ul>
                <li>Start with a clear introduction</li>
                <li>Break content into logical sections</li>
                <li>Use headings for organization (H2 for main sections, H3 for subsections)</li>
                <li>Include practical examples and code snippets where relevant</li>
                <li>End with a summary and key takeaways</li>
              </ul>

              <h3>Markdown Tips</h3>
              <pre className="language-markdown">
                {`# H1 Heading
## H2 Heading
### H3 Heading

**Bold text**
*Italic text*

- Bullet points
1. Numbered lists

\`\`\`javascript
// Code blocks
const example = "Hello World";
\`\`\`

> Blockquotes for important notes

[Link text](URL)
![Image alt text](URL)`}
              </pre>

              <h3>Best Practices</h3>
              <ul>
                <li>Keep paragraphs concise and focused</li>
                <li>Use active voice</li>
                <li>Include relevant images and diagrams</li>
                <li>Add practical exercises and knowledge checks</li>
                <li>Link to additional resources when appropriate</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
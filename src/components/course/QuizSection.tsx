import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/Alert';
import { updateLessonProgress } from '@/lib/course';

interface QuizSectionProps {
  quiz: any;
  lessonId: string;
  courseId: string;
  moduleId: string;
}

export function QuizSection({ quiz, lessonId, courseId, moduleId }: QuizSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (selectedAnswers.length !== quiz.questions.length) {
      setError('Please answer all questions');
      return;
    }

    const correctAnswers = quiz.questions.reduce((acc: number, q: any, index: number) => {
      return acc + (selectedAnswers[index] === q.correct ? 1 : 0);
    }, 0);

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    try {
      await updateLessonProgress(courseId, moduleId, lessonId, {
        completed: finalScore >= 70,
        quizScore: finalScore
      });
    } catch (err) {
      console.error('Error updating quiz progress:', err);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h3 className="text-xl font-bold mb-6">Quiz</h3>
      {error && <Alert type="error" message={error} />}
      
      <div className="space-y-6">
        {quiz.questions.map((question: any, qIndex: number) => (
          <div key={question.id} className="space-y-4">
            <p className="font-medium">{qIndex + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option: string, oIndex: number) => (
                <label
                  key={oIndex}
                  className={`flex items-center p-4 rounded-lg border cursor-pointer
                    ${submitted
                      ? oIndex === question.correct
                        ? 'border-success bg-success/10'
                        : selectedAnswers[qIndex] === oIndex
                          ? 'border-error bg-error/10'
                          : 'border-border'
                      : 'border-border hover:bg-accent'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    value={oIndex}
                    checked={selectedAnswers[qIndex] === oIndex}
                    onChange={() => {
                      const newAnswers = [...selectedAnswers];
                      newAnswers[qIndex] = oIndex;
                      setSelectedAnswers(newAnswers);
                    }}
                    disabled={submitted}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="mt-6">
          <Alert
            type={score! >= 70 ? 'success' : 'error'}
            message={`Your score: ${score}%. ${
              score! >= 70 
                ? 'Congratulations! You passed the quiz.'
                : 'Please review the material and try again.'
            }`}
          />
        </div>
      ) : (
        <Button onClick={handleSubmit} className="mt-6">
          Submit Quiz
        </Button>
      )}
    </div>
  );
}
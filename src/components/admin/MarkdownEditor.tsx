import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
  const { theme } = useTheme();

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[
          markdown(),
          EditorView.lineWrapping
        ]}
        theme={theme === 'dark' ? vscodeDark : xcodeLight}
        className="text-sm"
        height="100%"
      />
    </div>
  );
}
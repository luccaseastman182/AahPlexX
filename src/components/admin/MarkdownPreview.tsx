import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js';

interface MarkdownPreviewProps {
  content: string;
}

// Configure marked with highlight.js
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // Convert markdown to HTML and sanitize
  const html = DOMPurify.sanitize(marked(content));

  return (
    <div 
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
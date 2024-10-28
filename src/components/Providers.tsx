import React, { useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '@/lib/theme';
import SuperTokens from "supertokens-auth-react";
import { SuperTokensConfig } from "@/lib/supertokens";

interface ProvidersProps {
  children: React.ReactNode;
}

// Initialize SuperTokens
if (typeof window !== "undefined") {
  SuperTokens.init(SuperTokensConfig);
}

export function Providers({ children }: ProvidersProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    document.documentElement.classList.toggle('dark', theme === 'dark');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
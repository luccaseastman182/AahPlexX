import { useEffect, useState } from 'react';
import { useStore } from './store';

export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | NABS`;
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export function useNotification() {
  const { addNotification, removeNotification } = useStore();

  return {
    notify: (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => {
      const id = Math.random().toString(36).substring(7);
      addNotification({ id, type, message, duration });
      return id;
    },
    remove: removeNotification,
  };
}
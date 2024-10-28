import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export const useStore = create<GlobalState>()(
  persist(
    (set) => ({
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'global-storage',
    }
  )
);
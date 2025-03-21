import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  language: string;
  notifications: Notification[];
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'pt-BR',
      notifications: [],
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) => 
        set((state) => ({ 
          notifications: [...state.notifications, notification] 
        })),
    }),
    {
      name: 'app-storage',
    }
  )
); 
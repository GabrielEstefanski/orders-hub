import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const CLAIMS = {
  NAME: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  ID: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
} as const;

const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return JSON.parse(atob(token.split('.')[1]));
};

interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}

const getBaseUrl = () => {
  return window.location.origin;
};

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      fetchUser: async () => {
        try {
          const payload = getTokenPayload();
          if (!payload) {
            set({ user: null });
            return;
          }

          const userId = payload[CLAIMS.ID];
          const userName = payload[CLAIMS.NAME];

          const userData = await api.get<User>(`/user/${userId}`);
          
          const user: User = {
            id: userData.id,
            name: userName,
            email: userData.email,
            profilePhoto: userData.profilePhoto 
              ? `${getBaseUrl()}${userData.profilePhoto}`
              : undefined
          };
          
          console.log('URL da foto de perfil final:', user.profilePhoto);
          
          set({ user });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          set({ user: null });
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
); 
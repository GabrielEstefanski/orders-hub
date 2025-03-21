import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormRegister, UseFormHandleSubmit, FieldErrors, UseFormWatch, FormState } from 'react-hook-form';
import api from '../services/api';
import { AuthResponse, type LoginFormInputs, RegisterFormInputs } from '../types/AuthInputs';
import { useUser } from './useUser';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types/User';

export function useAuth<T extends LoginFormInputs | RegisterFormInputs>() {
  const { register, handleSubmit, formState, watch } = useForm<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('token'));
  const { fetchUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  
  const isPublicRoute = useCallback(() => {
    return publicRoutes.some(route => location.pathname.startsWith(route));
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      setAccessToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  const shouldRefreshToken = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp - 60000;
    } catch {
      return true;
    }
  };

  const refreshToken = async () => {
    if (isPublicRoute()) {
      setLoading(false);
      return false;
    }
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('UserId não encontrado');
      }

      const response = await api.post<AuthResponse>('/auth/refresh-token', { userId });
      
      if (!response.token) {
        throw new Error('Token não recebido');
      }

      localStorage.setItem('token', response.token);
      setAccessToken(response.token);
      
      await fetchUser();
      return true;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setAccessToken(null);
      setError('Erro ao renovar token');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/auth/login', data);

      if (!response.token) {
        throw new Error('Token não recebido');
      }

      setAccessToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      
      window.dispatchEvent(new Event('storage'));
      await fetchUser();

      return { success: true };
    } catch (err) {
      setError('Falha ao realizar login');
      console.error(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormInputs) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      if (data.profilePhoto) {
        formData.append('profilePhoto', data.profilePhoto);
      }

      await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': undefined
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { success: false, error };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAccessToken(null);
    setUser(null);
    navigate('/auth/login');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      if (isPublicRoute()) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get<User>('/auth/me');
        setUser(userData);
      } catch (err) {
        if (!isPublicRoute()) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            logout();
          }
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [isPublicRoute, logout]);

  useEffect(() => {
    if (!isPublicRoute()) {
      const intervalId = setInterval(() => {
        if (shouldRefreshToken()) {
          refreshToken();
        }
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [isPublicRoute]);

  return {
    register,
    handleSubmit,
    formState,
    errors: formState.errors,
    loading,
    watch,
    error,
    accessToken,
    refreshToken,
    onLogin,
    onRegister,
    logout,
    user,
  } as {
    register: UseFormRegister<T>;
    handleSubmit: UseFormHandleSubmit<T>;
    formState: FormState<T>;
    errors: FieldErrors<T>;
    loading: boolean;
    watch: UseFormWatch<T>;
    error: string | null;
    accessToken: string | null;
    refreshToken: () => Promise<boolean>;
    onLogin: (data: LoginFormInputs) => Promise<{ success: boolean }>;
    onRegister: (data: RegisterFormInputs) => Promise<{ success: boolean }>;
    logout: () => void;
    user: User | null;
  };
}

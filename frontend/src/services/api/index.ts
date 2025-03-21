import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toastService } from '../toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheItem {
  data: any;
  timestamp: number;
}

class ApiService {
  private cache: Map<string, CacheItem> = new Map();
  public axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;

          switch (status) {
            case 400:
              toastService.error({
                title: 'Erro de Validação',
                message: 'Por favor, verifique os dados informados.'
              });
              break;
            case 401:
              toastService.error({
                title: 'Sessão Expirada',
                message: 'Por favor, faça login novamente.'
              });
              localStorage.removeItem('token');
              break;
            case 403:
              toastService.error({
                title: 'Acesso Negado',
                message: 'Você não tem permissão para acessar este recurso.'
              });
              break;
            case 404:
              toastService.error({
                title: 'Não Encontrado',
                message: 'O recurso solicitado não foi encontrado.'
              });
              break;
            case 429:
              toastService.warning({
                title: 'Muitas Requisições',
                message: 'Por favor, aguarde um momento antes de tentar novamente.'
              });
              break;
            case 500:
              toastService.error({
                title: 'Erro do Servidor',
                message: 'Ocorreu um erro interno. Tente novamente mais tarde.'
              });
              break;
            default:
              toastService.error({
                title: 'Erro Inesperado',
                message: 'Ocorreu um erro inesperado. Tente novamente.'
              });
          }
        } else if (error.request) {
          toastService.error({
            title: 'Erro de Conexão',
            message: 'Não foi possível conectar ao servidor.'
          });
        } else {
          toastService.error({
            title: 'Erro',
            message: 'Erro ao processar sua requisição.'
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private getCacheKey(url: string, params?: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
  }

  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp < CACHE_DURATION;
  }

  async get<T>(url: string, config?: AxiosRequestConfig, useCache = true): Promise<T> {
    const cacheKey = this.getCacheKey(url, config?.params);
    
    if (useCache && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }
    
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      
      if (useCache) {
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${url}:`, error);
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao enviar para ${url}:`, error);
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar ${url}:`, error);
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      
      this.invalidateRelatedCache(url);
      
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir ${url}:`, error);
      throw error;
    }
  }

  private invalidateRelatedCache(url: string): void {
    const baseResource = url.split('/')[1];
    
    for (const key of this.cache.keys()) {
      if (key.includes(baseResource)) {
        this.cache.delete(key);
      }
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

const apiService = new ApiService();
export default apiService;
export const api = apiService.axiosInstance;

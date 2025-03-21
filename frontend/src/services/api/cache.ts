const CACHE_DURATION = 5 * 60 * 1000;

interface CacheItem {
  data: any;
  timestamp: number;
}

export class ApiCache {
  private cache: Map<string, CacheItem> = new Map();
  
  getCacheKey(url: string, params?: any): string {
    return `${url}:${JSON.stringify(params || {})}`;
  }

  isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp < CACHE_DURATION;
  }
  
  get<T>(cacheKey: string): T | null {
    if (!this.isCacheValid(cacheKey)) return null;
    return this.cache.get(cacheKey)!.data;
  }
  
  set<T>(cacheKey: string, data: T): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }
  
  invalidateRelatedCache(url: string): void {
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

export const apiCache = new ApiCache();

export function setupApiCache(apiService: any) {
  const originalGet = apiService.get;
  const originalPost = apiService.post;
  const originalPut = apiService.put;
  const originalDelete = apiService.delete;

  apiService.get = async function<T>(url: string, config?: any, useCache = true): Promise<T> {
    const cacheKey = apiCache.getCacheKey(url, config?.params);
    
    if (useCache) {
      const cachedData = apiCache.get<T>(cacheKey);
      if (cachedData) return cachedData;
    }
    
    const response = await originalGet.call(this, url, config);
    
    if (useCache) {
      apiCache.set(cacheKey, response);
    }
    
    return response;
  };

  apiService.post = async function<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await originalPost.call(this, url, data, config);
    apiCache.invalidateRelatedCache(url);
    return response;
  };
  
  apiService.put = async function<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await originalPut.call(this, url, data, config);
    apiCache.invalidateRelatedCache(url);
    return response;
  };
  
  apiService.delete = async function<T>(url: string, config?: any): Promise<T> {
    const response = await originalDelete.call(this, url, config);
    apiCache.invalidateRelatedCache(url);
    return response;
  };
  
  return apiService;
}

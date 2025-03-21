namespace OrdersAPI.Core.Interfaces
{
    public interface ICacheService
    {
        Task<T> GetCacheDataAsync<T>(string key);
        Task SetCacheDataAsync<T>(string key, T value, TimeSpan? expiry = null);
        Task RemoveCacheDataAsync(string key);
        Task<bool> KeyExistsAsync(string key);
        Task ClearExpiredKeysAsync();
        Task InvalidateByPatternAsync(string pattern);
        Task<IDictionary<string, T>> GetAllByPatternAsync<T>(string pattern);
    }
}

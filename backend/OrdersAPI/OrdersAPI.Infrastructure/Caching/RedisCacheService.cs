using Microsoft.Extensions.Configuration;
using StackExchange.Redis;
using System.Text.Json;
using OrdersAPI.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace OrdersAPI.Infrastructure.Caching
{
    public class RedisCacheService : ICacheService, IDisposable
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IDatabase _db;
        private readonly TimeSpan _defaultExpiry = TimeSpan.FromHours(1);
        private readonly IConfiguration _configuration;
        private readonly JsonSerializerOptions _jsonOptions;
        private const string CACHE_PREFIX = "orders-api:";
        private readonly ILogger<RedisCacheService> _logger;

        public RedisCacheService(IConfiguration configuration, ILogger<RedisCacheService> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var redisConnection = configuration["Redis:Connection"] ?? 
                throw new InvalidOperationException("Redis connection string is not configured.");
                
            var options = ConfigurationOptions.Parse(redisConnection);
            options.ConnectRetry = 5;
            options.ConnectTimeout = 5000;
            options.SyncTimeout = 5000;
            options.AbortOnConnectFail = false;
            options.ReconnectRetryPolicy = new ExponentialRetry(5000);
            options.KeepAlive = 60;
            options.AllowAdmin = true;
            
            _redis = ConnectionMultiplexer.Connect(options);
            _db = _redis.GetDatabase();

            ConfigureEventHandlers();
        }

        private void ConfigureEventHandlers()
        {
            _redis.ConnectionFailed += (sender, e) =>
            {
                _logger.LogError($"Conexão com Redis falhou: {e.Exception}");
            };

            _redis.ConnectionRestored += (sender, e) =>
            {
                _logger.LogInformation("Conexão com Redis restaurada");
            };

            _redis.ErrorMessage += (sender, e) =>
            {
                _logger.LogError($"Erro Redis: {e.Message}");
            };
        }

        private string FormatKey(string key) => $"{CACHE_PREFIX}{key}";

        public async Task<T?> GetCacheDataAsync<T>(string key)
        {
            try
            {
                var value = await _db.StringGetAsync(FormatKey(key));
                if (value.IsNull)
                    return default;

                return JsonSerializer.Deserialize<T>(value, _jsonOptions);
            }
            catch (RedisConnectionException ex)
            {
                _logger.LogError($"Erro ao conectar com Redis: {ex.Message}");
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao recuperar do Redis: {ex.Message}");
                return default;
            }
        }

        public async Task SetCacheDataAsync<T>(string key, T value, TimeSpan? expiry = null)
        {
            try
            {
                var serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
                await _db.StringSetAsync(
                    key: FormatKey(key),
                    value: serializedValue,
                    expiry: expiry ?? _defaultExpiry,
                    when: When.Always,
                    CommandFlags.FireAndForget
                );
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao salvar no Redis: {ex.Message}");
            }
        }

        public async Task RemoveCacheDataAsync(string key)
        {
            try
            {
                await _db.KeyDeleteAsync(FormatKey(key), CommandFlags.FireAndForget);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao remover chave do Redis: {ex.Message}");
            }
        }

        public async Task<bool> KeyExistsAsync(string key)
        {
            try
            {
                return await _db.KeyExistsAsync(FormatKey(key));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao verificar existência da chave no Redis: {ex.Message}");
                return false;
            }
        }

        public async Task ClearExpiredKeysAsync()
        {
            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var keys = server.Keys(pattern: $"{CACHE_PREFIX}*").ToArray();
                
                foreach (var key in keys)
                {
                    var ttl = await _db.KeyTimeToLiveAsync(key);
                    if (!ttl.HasValue || ttl.Value.TotalMilliseconds <= 0)
                    {
                        await _db.KeyDeleteAsync(key, CommandFlags.FireAndForget);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao limpar chaves expiradas: {ex.Message}");
            }
        }

        public async Task InvalidateByPatternAsync(string pattern)
        {
            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var keys = server.Keys(pattern: $"{CACHE_PREFIX}{pattern}*").ToArray();

                var tasks = keys.Select(key => _db.KeyDeleteAsync(key, CommandFlags.FireAndForget));
                await Task.WhenAll(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao invalidar cache por padrão: {ex.Message}");
            }
        }

        public async Task<IDictionary<string, T>> GetAllByPatternAsync<T>(string pattern)
        {
            try
            {
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                var keys = server.Keys(pattern: $"{CACHE_PREFIX}{pattern}*").ToArray();
                var result = new Dictionary<string, T>();

                foreach (var key in keys)
                {
                    var value = await _db.StringGetAsync(key);
                    if (!value.IsNull)
                    {
                        var keyWithoutPrefix = key.ToString().Replace(CACHE_PREFIX, "");
                        result[keyWithoutPrefix] = JsonSerializer.Deserialize<T>(value, _jsonOptions);
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao buscar cache por padrão: {ex.Message}");
                return new Dictionary<string, T>();
            }
        }

        public void Dispose()
        {
            if (_redis != null)
            {
                try
                {
                    _redis.Close();
                    (_redis as IDisposable)?.Dispose();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao fechar conexão Redis: {ex.Message}");
                }
            }
        }
    }
}

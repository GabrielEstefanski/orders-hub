using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.Extensions.Caching.Distributed;
using RabbitMQ.Client;
using Npgsql;
using OrdersAPI.Core.Interfaces;

namespace OrdersAPI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PerformanceController : ControllerBase
{
    private readonly IDistributedCache _cache;
    private readonly IConnection _rabbitMqConnection;
    private readonly ILogger<PerformanceController> _logger;
    private readonly IConfiguration _configuration;
    private readonly IMetricsService _metricsService;

    public PerformanceController(
        IDistributedCache cache,
        IConnection rabbitMqConnection,
        ILogger<PerformanceController> logger,
        IConfiguration configuration,
        IMetricsService metricsService)
    {
        _cache = cache;
        _rabbitMqConnection = rabbitMqConnection;
        _logger = logger;
        _configuration = configuration;
        _metricsService = metricsService;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        await UpdateRabbitMQMetrics();

        var cpuUsage = _metricsService.GetCpuUsage();
        var memoryUsageMB = _metricsService.GetMemoryUsageMB();
        
        _logger.LogInformation($"Métricas do sistema - CPU: {cpuUsage:F2}%, Memória: {memoryUsageMB:F2} MB");

        var metrics = new
        {
            performance = new
            {
                throughputPerMinute = _metricsService.GetThroughputPerMinute(),
                errorRate = _metricsService.GetErrorRate(),
                serviceLevel = _metricsService.GetServiceLevel(),
                resourceSaturation = _metricsService.GetResourceSaturation(),
                p95LatencySeconds = _metricsService.GetP95Latency(),
                slaCompliancePercentage = _metricsService.GetSlaCompliance(),
                responseTimesByEndpoint = new
                {
                    overall = new
                    {
                        p95 = _metricsService.GetP95Latency(),
                        sla = _metricsService.GetSlaCompliance()
                    },
                    endpoints = new[] 
                    {
                        "/api/orders",
                        "/api/users",
                    }.Select(endpoint => new
                    {
                        endpoint,
                        p95 = _metricsService.GetP95Latency(endpoint),
                        sla = _metricsService.GetSlaCompliance()
                    })
                }
            },
            users = new
            {
                activeCount = _metricsService.GetActiveUsersCount(),
                threadCount = Process.GetCurrentProcess().Threads.Count,
                handleCount = Process.GetCurrentProcess().HandleCount
            },
            systemResources = new 
            {
                cpuUsage,
                memoryUsageMB
            },
            cache = new
            {
                hitRate = _metricsService.GetCacheHitRate(),
                hits = _metricsService.GetTotalCacheHits(),
                misses = _metricsService.GetTotalCacheMisses(),
                hitRateByType = new
                {
                    redis = _metricsService.GetCacheHitRate("redis"),
                    database = _metricsService.GetCacheHitRate("database")
                }
            },
            services = new
            {
                redis = await CheckRedisStatus(),
                rabbitMQ = _rabbitMqConnection?.IsOpen == true,
                api = true
            },
            database = await GetDatabaseMetrics(),
            resilience = new
            {
                circuitBreaker = new
                {
                    database = _metricsService.GetCircuitBreakerStatus("database"),
                    redis = _metricsService.GetCircuitBreakerStatus("redis"),
                    rabbitMq = _metricsService.GetCircuitBreakerStatus("rabbitmq")
                },
                recoveredErrors = _metricsService.GetRecoveredErrorsCount(),
                retryAttempts = _metricsService.GetRetryAttemptsCount()
            }
        };

        return Ok(new { data = metrics });
    }

    private async Task<bool> CheckRedisStatus()
    {
        try
        {
            var testKey = "health:test:" + Guid.NewGuid();
            await _cache.SetStringAsync(testKey, "test", new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(1)
            });
            var redisValue = await _cache.GetStringAsync(testKey);
            return redisValue == "test";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar Redis");
            return false;
        }
    }

    private async Task<object> GetDatabaseMetrics()
    {
        try
        {
            using var connection = new NpgsqlConnection(_configuration.GetConnectionString("DbConnection"));
            await connection.OpenAsync();
            
            const string sql = @"
                SELECT 
                    count(*) FILTER (WHERE state = 'active') as active,
                    count(*) FILTER (WHERE state = 'idle') as idle,
                    count(*) as total
                FROM pg_stat_activity;";
            
            using var cmd = new NpgsqlCommand(sql, connection);
            using var reader = await cmd.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return new
                {
                    active = reader.GetInt32(0),
                    idle = reader.GetInt32(1),
                    total = reader.GetInt32(2)
                };
            }
            
            return new
            {
                active = 0,
                idle = 0,
                total = 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao coletar métricas do banco de dados");
            return new
            {
                active = 0,
                idle = 0,
                total = 0,
                error = ex.Message
            };
        }
    }

    private async Task UpdateRabbitMQMetrics()
    {
        try
        {
            using var channel = await _rabbitMqConnection.CreateChannelAsync();
            var queues = new[] { "order_queue" };
            
            foreach (var queueName in queues)
            {
                try
                {
                    var queueDeclareOk = await channel.QueueDeclarePassiveAsync(queueName);
                    _logger.LogInformation($"Fila {queueName}: {queueDeclareOk.MessageCount} mensagens");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Erro ao verificar fila {queueName}");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao coletar métricas do RabbitMQ");
        }
    }
} 
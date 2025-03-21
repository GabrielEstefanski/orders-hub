using Prometheus;
using OrdersAPI.Core.Interfaces;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Collections.Concurrent;
using System.Linq;

namespace OrdersAPI.Infrastructure.Services
{
    public class PrometheusMetricsService : IMetricsService
    {
        private readonly ILogger<PrometheusMetricsService> _logger;
        private Process _process;
        private DateTime _lastCpuCheck;
        private TimeSpan _lastCpuTime;
        private readonly ConcurrentDictionary<string, long> _requestCounters = new();
        
        private readonly ConcurrentDictionary<string, List<double>> _responseTimeSamples = new();
        private readonly ConcurrentDictionary<string, (int Total, int WithinSLA)> _slaSamples = new();
        
        private readonly Gauge _cpuUsage;
        private readonly Gauge _memoryUsage;
        private readonly Gauge _threadCount;
        private readonly Gauge _handleCount;
        
        private readonly Gauge _throughputPerMinute;
        private readonly Gauge _errorRate;
        private readonly Gauge _serviceLevel;
        private readonly Gauge _resourceSaturation;
        
        private readonly Counter _apiRequests;
        private readonly Histogram _apiResponseTime;
        
        private readonly Counter _cacheHits;
        private readonly Counter _cacheMisses;
        
        private readonly Counter _recoveredErrors;
        private readonly Counter _retryAttempts;
        private readonly Gauge _circuitBreakerStatus;
        
        private readonly Gauge _databaseConnections;
        private readonly Gauge _databaseIdleConnections;
        private readonly Gauge _databaseTotalConnections;
        private readonly Histogram _databaseQueryTime;

        private readonly Timer _metricsTimer;
        private readonly Timer _throughputTimer;

        private readonly Counter _processedOrders;
        private readonly Histogram _processingTime;
        private readonly Gauge _activeUsers;

        private readonly Histogram _apiLatency;
        private readonly Gauge _slaCompliance;
        private readonly Gauge _p95Latency;
        private readonly Timer _latencyCalculationTimer;

        private long _errorCount = 0;

        public PrometheusMetricsService(ILogger<PrometheusMetricsService> logger)
        {
            _logger = logger;
            _process = Process.GetCurrentProcess();
            _lastCpuCheck = DateTime.UtcNow;
            _lastCpuTime = _process.TotalProcessorTime;

            _cpuUsage = Metrics.CreateGauge("system_cpu_usage", "Current CPU usage percentage");
            _memoryUsage = Metrics.CreateGauge("system_memory_usage_mb", "Current memory usage in MB");
            _threadCount = Metrics.CreateGauge("system_thread_count", "Number of active threads");
            _handleCount = Metrics.CreateGauge("system_handle_count", "Number of system handles");

            _throughputPerMinute = Metrics.CreateGauge("throughput_per_minute", "Requests per minute");
            _errorRate = Metrics.CreateGauge("error_rate", "Current error rate percentage");
            _serviceLevel = Metrics.CreateGauge("service_level", "Service level percentage");
            _resourceSaturation = Metrics.CreateGauge("resource_saturation", "Resource usage saturation");

            _apiRequests = Metrics.CreateCounter("api_requests_total", "Total API requests", 
                new CounterConfiguration { LabelNames = ["endpoint", "method", "status", "error_type"] });
            _apiResponseTime = Metrics.CreateHistogram("api_response_time_seconds", "API response time",
                new HistogramConfiguration { LabelNames = ["endpoint", "method"] });

            _cacheHits = Metrics.CreateCounter("cache_hits_total", "Total cache hits",
                new CounterConfiguration { LabelNames = ["cache_type", "operation"] });
            _cacheMisses = Metrics.CreateCounter("cache_misses_total", "Total cache misses",
                new CounterConfiguration { LabelNames = ["cache_type", "operation"] });

            _recoveredErrors = Metrics.CreateCounter("recovered_errors_total", "Total recovered errors");
            _retryAttempts = Metrics.CreateCounter("retry_attempts_total", "Total retry attempts");
            _circuitBreakerStatus = Metrics.CreateGauge("circuit_breaker_status", "Circuit breaker status",
                new GaugeConfiguration { LabelNames = ["service"] });

            _databaseConnections = Metrics.CreateGauge("database_active_connections", "Active database connections");
            _databaseIdleConnections = Metrics.CreateGauge("database_idle_connections", "Idle database connections");
            _databaseTotalConnections = Metrics.CreateGauge("database_total_connections", "Total database connections");
            _databaseQueryTime = Metrics.CreateHistogram("database_query_seconds", "Database query execution time",
                new HistogramConfiguration { LabelNames = ["operation"] });

            _metricsTimer = new Timer(UpdateSystemMetrics, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));
            _throughputTimer = new Timer(CalculateThroughput, null, TimeSpan.Zero, TimeSpan.FromSeconds(30));

            _processedOrders = Metrics.CreateCounter("processed_orders_total", 
                "Total de pedidos processados", 
                new CounterConfiguration { LabelNames = ["status", "type"] });
            
            _processingTime = Metrics.CreateHistogram("processing_time_seconds", 
                "Tempo de processamento", 
                new HistogramConfiguration { LabelNames = ["operation"] });
            
            _activeUsers = Metrics.CreateGauge("active_users", 
                "Número de usuários ativos");

            _apiLatency = Metrics.CreateHistogram(
                "api_latency_seconds",
                "API latency in seconds",
                new HistogramConfiguration
                {
                    LabelNames = ["endpoint", "method"],
                    Buckets = [0.1, 0.25, 0.5, 1, 2.5, 5, 10]
                });
            
            _slaCompliance = Metrics.CreateGauge(
                "sla_compliance_percentage",
                "Percentage of requests meeting SLA targets");
                
            _p95Latency = Metrics.CreateGauge(
                "p95_latency_seconds",
                "95th percentile latency in seconds");
                
            _latencyCalculationTimer = new Timer(CalculateLatencyMetrics, null, TimeSpan.Zero, TimeSpan.FromSeconds(15));
        }

        private void CalculateLatencyMetrics(object? state)
        {
            try
            {
                const int maxSampleSize = 1000;
                
                var allSamples = new List<double>();
                int totalRequests = 0;
                int requestsWithinSla = 0;
                
                foreach (var kvp in _responseTimeSamples)
                {
                    var samples = kvp.Value;
                    if (samples.Count > maxSampleSize)
                    {
                        samples = samples.Skip(samples.Count - maxSampleSize).ToList();
                        _responseTimeSamples[kvp.Key] = samples;
                    }
                    
                    allSamples.AddRange(samples);
                }
                
                foreach (var kvp in _slaSamples)
                {
                    totalRequests += kvp.Value.Total;
                    requestsWithinSla += kvp.Value.WithinSLA;
                }
                
                if (allSamples.Count > 0)
                {
                    allSamples.Sort();
                    int p95Index = (int)Math.Ceiling(allSamples.Count * 0.95) - 1;
                    if (p95Index >= 0 && p95Index < allSamples.Count)
                    {
                        _p95Latency.Set(allSamples[p95Index]);
                    }
                }
                
                if (totalRequests > 0)
                {
                    double compliance = (double)requestsWithinSla / totalRequests * 100;
                    _slaCompliance.Set(compliance);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao calcular métricas de latência");
            }
        }

        private void UpdateSystemMetrics(object? state)
        {
            try
            {
                _process.Refresh();
                
                var currentTime = DateTime.UtcNow;
                var currentCpuTime = _process.TotalProcessorTime;
                
                var elapsedSeconds = (currentTime - _lastCpuCheck).TotalSeconds;
                var cpuUsedMs = (currentCpuTime - _lastCpuTime).TotalMilliseconds;
                
                if (elapsedSeconds > 0)
                {
                    var cpuUsagePercent = (cpuUsedMs / (Environment.ProcessorCount * elapsedSeconds * 1000)) * 100;
                    _cpuUsage.Set(Math.Min(cpuUsagePercent, 100));

                    var memoryUsagePercent = (_process.WorkingSet64 / (double)_process.MaxWorkingSet) * 100;
                    var resourceSaturation = (cpuUsagePercent + memoryUsagePercent) / 2;
                    _resourceSaturation.Set(Math.Min(resourceSaturation / 100, 1));

                    var totalRequests = _apiRequests.Value;
                    var errorRequests = _errorRate.Value;
                    if (totalRequests > 0)
                    {
                        var successRate = Math.Max(0, (totalRequests - errorRequests) / totalRequests);
                        _serviceLevel.Set(successRate);
                    }

                    var currentThroughput = _requestCounters.Values.Sum() + 
                                          _processedOrders.Value +
                                          _cacheHits.Value + 
                                          _cacheMisses.Value;
                    _throughputPerMinute.Set(currentThroughput / elapsedSeconds * 60);
                }

                _lastCpuCheck = currentTime;
                _lastCpuTime = currentCpuTime;

                _memoryUsage.Set(_process.WorkingSet64 / 1024.0 / 1024.0);
                _threadCount.Set(_process.Threads.Count);
                _handleCount.Set(_process.HandleCount);

                _logger.LogDebug("Métricas atualizadas - CPU: {CpuUsage:F2}%, SLA: {ServiceLevel:F2}%, Saturação: {ResourceSaturation:F2}, Throughput: {Throughput:F2}",
                    _cpuUsage.Value, 
                    _serviceLevel.Value * 100, 
                    _resourceSaturation.Value * 100,
                    _throughputPerMinute.Value);
            }
            catch (Exception ex)
            {   
                _logger.LogError(ex, "Erro ao atualizar métricas de sistema");
            }
        }

        private void CalculateThroughput(object? state)
        {
            try 
            {
                var currentTime = DateTime.UtcNow;
                var elapsedMinutes = (currentTime - _lastCpuCheck).TotalMinutes;
                
                if (elapsedMinutes > 0)
                {
                    var totalOperations = _requestCounters.Values.Sum() + 
                                        _processedOrders.Value +
                                        _cacheHits.Value + 
                                        _cacheMisses.Value;
                    
                    var throughputPerMinute = totalOperations / elapsedMinutes;
                    _throughputPerMinute.Set(throughputPerMinute);
                    _requestCounters.Clear();
                    
                    _logger.LogInformation("Throughput calculado: {ThroughputPerMinute:F2} operações/min", throughputPerMinute);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao calcular throughput");
            }
        }

        public void RecordApiRequest(string endpoint, string method, int statusCode, string errorType = "none")
        {
            _apiRequests.Labels(endpoint, method, statusCode.ToString(), errorType).Inc();
            
            string key = $"{method}:{endpoint}";
            _requestCounters.AddOrUpdate(key, 1, (_, count) => count + 1);
            
            if (statusCode >= 400)
            {
                _errorCount++;
            }
            
            double totalRequests = _apiRequests.Value;
            if (totalRequests > 0)
            {
                double errorRate = (_errorCount / totalRequests) * 100;
                _errorRate.Set(errorRate);
            }
        }

        public void RecordApiResponseTime(string endpoint, string method, double seconds)
        {
            try
            {
                _apiLatency.Labels(endpoint, method).Observe(seconds);
                _apiResponseTime.Labels(endpoint, method).Observe(seconds);
                
                string key = $"{method}:{endpoint}";
                _responseTimeSamples.AddOrUpdate(
                    key,
                    new List<double> { seconds },
                    (_, samples) => {
                        samples.Add(seconds);
                        return samples;
                    });
                
                const double slaTarget = 2.0;
                bool withinSla = seconds <= slaTarget;
                
                _slaSamples.AddOrUpdate(
                    key, 
                    (1, withinSla ? 1 : 0),
                    (_, current) => (
                        current.Total + 1,
                        current.WithinSLA + (withinSla ? 1 : 0)
                    ));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao registrar tempo de resposta da API");
            }
        }

        public void RecordCacheHit(string cacheType, string operation)
        {
            _cacheHits.Labels(cacheType, operation).Inc();
        }

        public void RecordCacheMiss(string cacheType, string operation)
        {
            _cacheMisses.Labels(cacheType, operation).Inc();
        }

        public void IncrementProcessedOrders(string status, string type)
        {
            _logger.LogDebug("Incrementando contador de pedidos processados: {Status}, {Type}", status, type);
            _processedOrders.Labels(status, type).Inc();
        }

        public void RecordProcessingTime(double seconds)
        {
            _logger.LogDebug("Registrando tempo de processamento: {Seconds}s", seconds);
            _processingTime.Observe(seconds);
        }

        public void IncrementActiveUsers()
        {
            _logger.LogDebug("Incrementando contador de usuários ativos");
            _activeUsers.Inc();
        }

        public void DecrementActiveUsers()
        {
            _logger.LogDebug("Decrementando contador de usuários ativos");
            _activeUsers.Dec();
        }

        public double GetCpuUsage() => _cpuUsage.Value;
        public double GetMemoryUsageMB() => _memoryUsage.Value;
        public double GetThroughputPerMinute() => _throughputPerMinute.Value;
        public double GetErrorRate() => _errorRate.Value;
        public double GetServiceLevel() => _serviceLevel.Value;
        public double GetResourceSaturation() => _resourceSaturation.Value;
        public double GetCacheHitRate(string cacheType = "")
        {
            if (string.IsNullOrEmpty(cacheType))
            {
                var totalHits = _cacheHits.Value;
                var totalMisses = _cacheMisses.Value;
                return totalHits + totalMisses > 0 ? totalHits / (totalHits + totalMisses) : 1;
            }
            
            var hits = _cacheHits.Labels(cacheType, "get").Value;
            var misses = _cacheMisses.Labels(cacheType, "get").Value;
            return hits + misses > 0 ? hits / (hits + misses) : 1;
        }

        public void RecordRecoveredError()
        {
            _recoveredErrors.Inc();
        }

        public void RecordRetryAttempt()
        {
            _retryAttempts.Inc();
        }

        public void RecordCircuitBreakerStatus(string service, string status)
        {
            _circuitBreakerStatus.Set(status == "open" ? 1 : 0);
        }

        public void RecordDatabaseConnectionStatus(int active, int idle, int total)
        {
            _databaseConnections.Set(active);
            _databaseIdleConnections.Set(idle);
            _databaseTotalConnections.Set(total);
        }

        public void RecordDatabaseQueryTime(string operation, double seconds)
        {
            _databaseQueryTime.Labels(operation).Observe(seconds);
        }

        public double GetActiveUsersCount() => _activeUsers.Value;

        public long GetTotalCacheHits() => (long)_cacheHits.Value;

        public long GetTotalCacheMisses() => (long)_cacheMisses.Value;

        public double GetRecoveredErrorsCount() => _recoveredErrors.Value;

        public double GetRetryAttemptsCount() => _retryAttempts.Value;

        public double GetCircuitBreakerStatus(string service) => 
            _circuitBreakerStatus.Labels(service).Value;

        public double GetP95Latency(string endpoint = "", string method = "")
        {
            try
            {
                if (string.IsNullOrEmpty(endpoint) && string.IsNullOrEmpty(method))
                {
                    return _p95Latency.Value;
                }
                
                string key = $"{method}:{endpoint}";
                if (_responseTimeSamples.TryGetValue(key, out var samples) && samples.Count > 0)
                {
                    var sortedSamples = samples.OrderBy(s => s).ToList();
                    int p95Index = (int)Math.Ceiling(sortedSamples.Count * 0.95) - 1;
                    if (p95Index >= 0 && p95Index < sortedSamples.Count)
                    {
                        return sortedSamples[p95Index];
                    }
                }
                
                return _p95Latency.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao calcular P95");
                return 0;
            }
        }

        public double GetSlaCompliance()
        {
            return _slaCompliance.Value;
        }

        private void CalculateErrorRate(object? state)
        {
            try
            {
                var totalRequests = _apiRequests.Value;
                if (totalRequests > 0)
                {
                    var errorRate = (_errorCount / totalRequests) * 100;
                    _errorRate.Set(Math.Min(errorRate, 100));
                    _logger.LogDebug("Taxa de erro atualizada: {ErrorRate:F2}%", errorRate);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao calcular taxa de erro");
            }
        }
    }
} 
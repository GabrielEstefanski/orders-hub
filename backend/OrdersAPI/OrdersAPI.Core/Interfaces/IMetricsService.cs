namespace OrdersAPI.Core.Interfaces;

public interface IMetricsService
{
    void RecordCacheHit(string cacheType, string operation);
    void RecordCacheMiss(string cacheType, string operation);
    double GetCacheHitRate(string cacheType = "");
    long GetTotalCacheHits();   
    long GetTotalCacheMisses();

    void IncrementProcessedOrders(string status, string type);
    void RecordProcessingTime(double seconds);

    void RecordApiRequest(string endpoint, string method, int statusCode, string errorType = "none");
    void RecordApiResponseTime(string endpoint, string method, double seconds);

    void IncrementActiveUsers();
    void DecrementActiveUsers();
    double GetActiveUsersCount();

    double GetCpuUsage();
    double GetMemoryUsageMB();

    double GetThroughputPerMinute();
    double GetErrorRate();
    double GetServiceLevel();
    double GetResourceSaturation();
    
    void RecordRecoveredError();
    void RecordRetryAttempt();
    double GetRecoveredErrorsCount();
    double GetRetryAttemptsCount();
    double GetCircuitBreakerStatus(string service);

    void RecordDatabaseConnectionStatus(int active, int idle, int total);
    void RecordDatabaseQueryTime(string operation, double seconds);

    double GetP95Latency(string endpoint = "", string method = "");
    double GetSlaCompliance();
} 
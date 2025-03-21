using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using OrdersAPI.Core.Interfaces;

namespace OrdersAPI.API.Middleware;

public class PerformanceMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<PerformanceMiddleware> _logger;
    private readonly IMetricsService _metricsService;

    public PerformanceMiddleware(
        RequestDelegate next, 
        ILogger<PerformanceMiddleware> logger,
        IMetricsService metricsService)
    {
        _next = next;
        _logger = logger;
        _metricsService = metricsService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var endpoint = context.Request.Path.Value ?? "unknown";
        var method = context.Request.Method;

        try
        {
            _metricsService.IncrementActiveUsers();
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            var duration = stopwatch.Elapsed.TotalSeconds;
            var statusCode = context.Response.StatusCode;
            
            _metricsService.RecordApiRequest(endpoint, method, statusCode, GetErrorType(statusCode));
            _metricsService.RecordApiResponseTime(endpoint, method, duration);
            
            if (duration > 2.0)
            {
                _logger.LogWarning(
                    "SLA violation - Method: {Method}, Path: {Path}, Duration: {Duration:F3}s, Status: {StatusCode}",
                    method, endpoint, duration, statusCode);
            }
            
            _metricsService.DecrementActiveUsers();
        }
    }

    private static string GetErrorType(int statusCode)
    {
        return statusCode switch
        {
            >= 500 => "server_error",
            >= 400 => "client_error",
            >= 300 => "redirect",
            >= 200 => "success",
            _ => "unknown"
        };
    }
} 
import api from './api';

export interface MetricsData {
  performance: {
    throughputPerMinute: number;
    errorRate: number;
    serviceLevel: number;
    resourceSaturation: number;
    p95LatencySeconds: number;
    slaCompliancePercentage: number;
    responseTimesByEndpoint?: {
      overall: {
        p95: number;
        sla: number;
      },
      endpoints: Array<{
        endpoint: string;
        p95: number;
        sla: number;
      }>
    };
  };
  users: {
    activeCount: number;
  };
  systemResources: {
    cpuUsage: number;
    memoryUsageMB: number;
    threadCount: number;
    handleCount: number;
  };
  cache: {
    hitRate: number;
    hits: number;
    misses: number;
    hitRateByType: {
      redis: number;
      database: number;
    };
  };
  services: {
    redis: boolean;
    rabbitMQ: boolean;
    api: boolean;
  };
  database: {
    active: number;
    idle: number;
    total: number;
  };
  resilience: {
    circuitBreaker: {
      database: number;
      redis: number;
      rabbitMq: number;
    };
    recoveredErrors: number;
    retryAttempts: number;
  };
  apiMetrics?: {
    requests: {
      total: number;
      byStatus: {
        success: number;
        clientError: number;
        serverError: number;
        redirect: number;
      };
      responseTime: {
        average: number;
        p95: number;
        p99: number;
      };
    };
  };
}

export const metricsService = {
  async getMetrics(): Promise<MetricsData> {
    try {
      const response = await api.get<{data: MetricsData}>('/performance/status');
      return this.processMetricsResponse(response.data);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  },

  processMetricsResponse(rawData: any): MetricsData {
    return {
      performance: {
        throughputPerMinute: Number(rawData.performance?.throughputPerMinute) || 0,
        errorRate: Number(rawData.performance?.errorRate) || 0,
        serviceLevel: Number(rawData.performance?.serviceLevel) || 0,
        resourceSaturation: Number(rawData.performance?.resourceSaturation) || 0,
        p95LatencySeconds: Number(rawData.performance?.p95LatencySeconds) || 0,
        slaCompliancePercentage: Number(rawData.performance?.slaCompliancePercentage) || 100,
        responseTimesByEndpoint: rawData.performance?.responseTimesByEndpoint ? {
          overall: {
            p95: Number(rawData.performance.responseTimesByEndpoint.overall?.p95) || 0,
            sla: Number(rawData.performance.responseTimesByEndpoint.overall?.sla) || 100
          },
          endpoints: Array.isArray(rawData.performance.responseTimesByEndpoint.endpoints) 
            ? rawData.performance.responseTimesByEndpoint.endpoints.map((ep: any) => ({
                endpoint: String(ep.endpoint),
                p95: Number(ep.p95) || 0,
                sla: Number(ep.sla) || 100
              }))
            : []
        } : undefined
      },
      users: {
        activeCount: Number(rawData.users?.activeCount) || 0,
      },
      systemResources: {
        cpuUsage: Number(rawData.systemResources?.cpuUsage) || 0,
        memoryUsageMB: Number(rawData.systemResources?.memoryUsageMB) || 0,
        threadCount: Number(rawData.systemResources?.threadCount) || 0,
        handleCount: Number(rawData.systemResources?.handleCount) || 0,
      },
      cache: {
        hitRate: Number(rawData.cache?.hitRate) || 0,
        hits: Number(rawData.cache?.hits) || 0,
        misses: Number(rawData.cache?.misses) || 0,
        hitRateByType: {
          redis: Number(rawData.cache?.hitRateByType?.redis) || 0,
          database: Number(rawData.cache?.hitRateByType?.database) || 0,
        },
      },
      services: {
        redis: Boolean(rawData.services?.redis),
        rabbitMQ: Boolean(rawData.services?.rabbitMQ),
        api: Boolean(rawData.services?.api),
      },
      database: {
        active: Number(rawData.database?.active) || 0,
        idle: Number(rawData.database?.idle) || 0,
        total: Number(rawData.database?.total) || 0,
      },
      resilience: {
        circuitBreaker: {
          database: Number(rawData.resilience?.circuitBreaker?.database) || 0,
          redis: Number(rawData.resilience?.circuitBreaker?.redis) || 0,
          rabbitMq: Number(rawData.resilience?.circuitBreaker?.rabbitMq) || 0,
        },
        recoveredErrors: Number(rawData.resilience?.recoveredErrors) || 0,
        retryAttempts: Number(rawData.resilience?.retryAttempts) || 0,
      },
    };
  },

  parseMetricValue(metrics: string, metricName: string): number {
    const regex = new RegExp(`${metricName}\\s+(\\d+(?:\\.\\d+)?)`);
    const match = metrics.match(regex);
    return match ? parseFloat(match[1]) : 0;
  },

  parseHistogramBuckets(metrics: string, metricName: string): Record<string, number> {
    const buckets: Record<string, number> = {};
    const regex = new RegExp(`${metricName}_bucket\\{le="([^"]+)"\\}\\s+(\\d+)`, 'g');
    let match;

    while ((match = regex.exec(metrics)) !== null) {
      buckets[match[1]] = parseFloat(match[2]);
    }

    return buckets;
  },

  calculatePercentile(buckets: Record<string, number>): number {
    const sortedBuckets = Object.entries(buckets)
      .map(([le, count]) => ({ le: parseFloat(le), count }))
      .sort((a, b) => a.le - b.le);

    const total = sortedBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
    let current = 0;

    for (const bucket of sortedBuckets) {
      current += bucket.count;
      if (current >= total) {
        return bucket.le;
      }
    }

    return sortedBuckets[sortedBuckets.length - 1]?.le || 0;
  },

  formatMetricValue(value: number, type: 'percentage' | 'time' | 'bytes' | 'number' = 'number'): string {
    switch (type) {
      case 'percentage':
        return `${(value).toFixed(2)}%`;
      case 'time':
        return value < 1000 ? `${value.toFixed(2)}ms` : `${(value / 1000).toFixed(2)}s`;
      case 'bytes':
        return value < 1024 ? `${value.toFixed(2)}B` :
               value < 1048576 ? `${(value / 1024).toFixed(2)}KB` :
               `${(value / 1048576).toFixed(2)}MB`;
      default:
        return value.toLocaleString();
    }
  }
}; 
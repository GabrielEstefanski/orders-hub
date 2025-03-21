using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OrdersAPI.Seeder.Generator;
using OrdersAPI.Infrastructure.Data;
using OrdersAPI.Core.Interfaces;
using System;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Transactions;

public class DatabaseSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly ICacheService _cacheService;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(
        ApplicationDbContext context, 
        ICacheService cacheService,
        ILogger<DatabaseSeeder> logger = null)
    {
        _context = context;
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task SeedMockDataAsync(int numberOfRecords, bool forceReseed = false)
    {
        var stopwatch = Stopwatch.StartNew();
        
        if (forceReseed)
        {
            _logger?.LogWarning("Forçando remoção de dados existentes...");
            await TruncateOrdersTableAsync();
        }

        var existingCount = await _context.Orders.CountAsync();
        
        if (existingCount == 0 || forceReseed)
        {
            _logger?.LogInformation($"Iniciando seed de {numberOfRecords} registros...");
            
            try
            {
                var originalAutoDetectChanges = _context.ChangeTracker.AutoDetectChangesEnabled;
                var originalQueryTrackingBehavior = _context.ChangeTracker.QueryTrackingBehavior;
                
                _context.ChangeTracker.AutoDetectChangesEnabled = false;
                _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    await MockDataGenerator.GenerateAndSaveOrdersInBatchesAsync(_context, numberOfRecords, logger: _logger);
                    scope.Complete();
                }

                _context.ChangeTracker.AutoDetectChangesEnabled = originalAutoDetectChanges;
                _context.ChangeTracker.QueryTrackingBehavior = originalQueryTrackingBehavior;
                
                await InvalidateCacheAsync();
                
                _logger?.LogInformation($"Seed concluído em {stopwatch.ElapsedMilliseconds}ms");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Erro durante a operação de seed");
                throw;
            }
        }
        else
        {
            _logger?.LogInformation($"Já existem {existingCount} registros na base. Seed ignorado.");
        }
    }

    public async Task TruncateOrdersTableAsync()
    {
        try
        {
            _logger?.LogWarning("Removendo todos os registros da tabela Orders...");
            
            await _context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE Orders");
            
            
            _logger?.LogWarning("Tabela Orders limpa com sucesso!");

        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Erro ao truncar tabela Orders");
            throw;
        }
    }

    private async Task InvalidateCacheAsync()
    {
        _logger?.LogInformation("Invalidando cache...");
        
        await _cacheService.InvalidateByPatternAsync("orders:");
        await _cacheService.InvalidateByPatternAsync("order:detail:");
        await _cacheService.InvalidateByPatternAsync("dashboard:");
        await _cacheService.RemoveCacheDataAsync("orders:search-terms");
        
        _logger?.LogInformation("Cache invalidado com sucesso!");
    }
}

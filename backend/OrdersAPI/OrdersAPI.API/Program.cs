using Polly;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Text;
using OrdersAPI.Infrastructure.Data;
using OrdersAPI.Infrastructure.Repositories;
using OrdersAPI.Core.Interfaces;
using OrdersAPI.API.Hubs;
using OrdersAPI.Application.Interfaces;
using OrdersAPI.Application.Services;
using OrdersAPI.API.Services;
using OrdersAPI.Infrastructure.Caching;
using OrdersAPI.Seeder.Generator;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Prometheus;
using Microsoft.Extensions.FileProviders;
using OrdersAPI.Infrastructure.Services;
using OrdersAPI.API.Middleware;
using RabbitMQ.Client;

var builder = WebApplication.CreateBuilder(args);

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"];

if (string.IsNullOrEmpty(secretKey))
{
    throw new ArgumentNullException("JWT Secret key is not configured properly.");
}

var key = Encoding.ASCII.GetBytes(secretKey);

var rabbitMqConnectionString = builder.Configuration["RabbitMq:ConnectionString"] ?? 
    throw new ArgumentNullException("RabbitMQ connection string is missing.");

var rabbitMqFactory = new ConnectionFactory() { Uri = new Uri(rabbitMqConnectionString) };
var rabbitMqConnection = rabbitMqFactory.CreateConnectionAsync().Result;

builder.Services.AddSingleton<IConnection>(rabbitMqConnection);
builder.Services.AddSingleton<IRabbitMqService>(serviceProvider =>
{
    var connection = serviceProvider.GetRequiredService<IConnection>();
    return new RabbitMqService(connection);
});

builder.Services.AddStackExchangeRedisCache(options =>
{
    var redisConnection = builder.Configuration["Redis:Connection"];
    if (string.IsNullOrEmpty(redisConnection))
    {
        throw new ArgumentNullException("Redis connection string não configurada.");
    }
    options.Configuration = redisConnection;
    options.InstanceName = "OrdersAPI";
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RequireSignedTokens = true
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };
});

var configuration = new ConfigurationBuilder()
    .AddEnvironmentVariables()
    .Build();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DbConnection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null
        )
    ));

builder.Services.AddScoped<ICacheService, RedisCacheService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderHistoryRepository, OrderHistoryRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddSingleton<IMetricsService, PrometheusMetricsService>();
builder.Services.AddHostedService<OrderProcessingWorker>();
builder.Services.AddTransient<MockDataGenerator>();
builder.Services.AddTransient<DatabaseSeeder>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowNamedFloatingPointLiterals;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddNpgSql(builder.Configuration.GetConnectionString("DbConnection") ?? throw new ArgumentNullException("DbConnection"), name: "database");

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Iniciando configuração do banco de dados...");
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        await context.Database.EnsureDeletedAsync();
        
        logger.LogInformation("Aplicando migrações...");
        await context.Database.MigrateAsync();
        logger.LogInformation("Migrações aplicadas com sucesso!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Ocorreu um erro durante a configuração do banco de dados.");
        throw;
    }
}

await RetryDatabaseConnectionAsync(app);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseRouting();
app.UseCors("AllowSpecificOrigin");
app.UseMetricServer();
app.UseHttpMetrics(options =>
{
    options.RequestDuration.Enabled = true;
    options.RequestCount.Enabled = true;
    options.InProgress.Enabled = true;
});

app.Logger.LogInformation("Endpoint de métricas configurado em /metrics");

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<PerformanceMiddleware>();

app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Configuration["UploadSettings:Path"] ?? throw new ArgumentException("Upload path não configurado"))),
    RequestPath = "/uploads"
});

app.MapControllers();
app.MapHub<NotificationHub>("/api/notifications");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            Status = report.Status.ToString(),
            Components = report.Entries.Select(e => new
            {
                Component = e.Key,
                Status = e.Value.Status.ToString(),
                Description = e.Value.Description
            }),
            Duration = report.TotalDuration
        };
        
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
});

app.Run();

async Task RetryDatabaseConnectionAsync(WebApplication app)
{
    var maxRetries = 10;
    var retryDelay = TimeSpan.FromSeconds(5);
    var policy = Policy.Handle<NpgsqlException>()
                       .WaitAndRetryAsync(maxRetries, _ => retryDelay);

    await policy.ExecuteAsync(async () =>
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        try
        {
            await dbContext.Database.OpenConnectionAsync();
            logger.LogInformation("Conexão com o banco de dados estabelecida com sucesso.");
            
            if ((await dbContext.Database.GetPendingMigrationsAsync()).Any())
            {
                logger.LogInformation("Aplicando migrações pendentes...");
                await dbContext.Database.MigrateAsync();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Erro ao conectar ao banco de dados ou aplicar migrações.");
            throw;
        }
    });
}
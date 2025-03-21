using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using System;

namespace OrdersAPI.Infrastructure.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var currentDir = Directory.GetCurrentDirectory();
            var projectRoot = currentDir;

            while (projectRoot != null && !Directory.Exists(Path.Combine(projectRoot, "OrdersAPI.API")))
            {
                projectRoot = Directory.GetParent(projectRoot)?.FullName;
            }
            
            var apiFolder = Path.Combine(projectRoot, "OrdersAPI.API");
            var appsettingsPath = Path.Combine(apiFolder, "appsettings.json");
            
            Console.WriteLine($"Buscando appsettings em: {appsettingsPath}");
            
            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiFolder)
                .AddJsonFile("appsettings.json", optional: true)
                .Build();
            var connectionString = configuration.GetConnectionString("DbConnection");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                connectionString = "Host=localhost;Database=ordersdb;Username=postgres;Password=postgres";
                Console.WriteLine($"String de conexão não encontrada. Usando padrão: {connectionString}");
            }

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
using Microsoft.EntityFrameworkCore;
using OrdersAPI.Core.Entities;

namespace OrdersAPI.Infrastructure.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderHistory> OrderHistories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.ProfilePhoto).HasMaxLength(255).IsRequired(false);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
            });

            modelBuilder.Entity<Order>()
                .Property(o => o.Id)
                .HasColumnType("uuid");

            modelBuilder.Entity<Order>()
                .Property(o => o.Valor)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderHistory>()
                .HasOne(h => h.Order)
                .WithMany()
                .HasForeignKey(h => h.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using AirportOperations.Domain.Entities;

namespace AirportOperations.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Aircraft> Aircraft { get; set; }
        public DbSet<StateChangeLog> StateChangeLog { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Aircraft>(entity =>
            {
                entity.HasKey(e => e.CallSign);
                entity.Property(e => e.CallSign).HasMaxLength(10);
            });

            modelBuilder.Entity<StateChangeLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CallSign).HasMaxLength(10);
            });
        }
    }

    public class StateChangeLog
    {
        public int Id { get; set; }
        public string CallSign { get; set; } = string.Empty;
        public AircraftState PreviousState { get; set; }
        public AircraftState RequestedState { get; set; }
        public DateTime Timestamp { get; set; }
        public bool Outcome { get; set; }
    }
} 
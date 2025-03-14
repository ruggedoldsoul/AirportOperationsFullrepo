using Microsoft.EntityFrameworkCore;
using AirportOperations.Domain.Entities;
using System;
using BC = BCrypt.Net.BCrypt;

namespace AirportOperations.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Aircraft> Aircraft { get; set; }
        public DbSet<StateChangeLog> StateChangeLogs { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Aircraft>(entity =>
            {
                entity.HasKey(e => e.CallSign);
                entity.Property(e => e.Type).IsRequired();
                entity.Property(e => e.State).IsRequired();
                entity.Property(e => e.LastUpdated).IsRequired();
                entity.Property(e => e.PublicKey).IsRequired();
            });

            modelBuilder.Entity<StateChangeLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Aircraft)
                      .WithMany()
                      .HasForeignKey(e => e.CallSign)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.RequestedState).IsRequired();
                entity.Property(e => e.Outcome).IsRequired();
                entity.Property(e => e.Timestamp).IsRequired();
            });

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();

                // Seed admin user
                entity.HasData(new Admin
                {
                    Id = 1,
                    Email = "Nakumoji@outlook.com",
                    PasswordHash = BC.HashPassword("Ab12345"),
                    CreatedAt = DateTime.UtcNow
                });
            });
        }
    }
} 
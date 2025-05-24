using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VehicleServiceApp.Models;

namespace VehicleServiceApp.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ServiceRecord> ServiceRecords { get; set; }
        public DbSet<ServiceTask> ServiceTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-many relationship configuration
            modelBuilder.Entity<ServiceRecord>()
                .HasMany(sr => sr.Tasks)
                .WithMany(st => st.ServiceRecords)
                .UsingEntity(j => j.ToTable("ServiceRecordServiceTask"));
        }
    }
}

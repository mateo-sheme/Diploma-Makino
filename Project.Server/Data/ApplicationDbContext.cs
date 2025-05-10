using Project.Server.Entities;
using Microsoft.EntityFrameworkCore;
namespace Project.Server.Data;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
    {
        
    }

    public DbSet<Cars_Sale> Cars_Sale { get; set; } //Dbset <emri i klases qe deklarova> me emrin qe do marri ne db
    public DbSet<Seller> Seller { get; set; }
    public DbSet<CarImage> CarImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships
        modelBuilder.Entity<Cars_Sale>()
            .HasMany(c => c.Images)
            .WithOne(i => i.Car)
            .HasForeignKey(i => i.Car_ID)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Seller>()
            .HasMany(s => s.Cars)
            .WithOne(c => c.Seller)
            .HasForeignKey(c => c.Seller_ID)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

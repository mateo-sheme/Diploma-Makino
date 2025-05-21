using Project.Server.Entities;
using Microsoft.EntityFrameworkCore;
namespace Project.Server.Data;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
    {
        
    }

    public DbSet<Cars_Sale> Cars_Sale { get; set; } //Dbset <emri i klases qe deklarova> me emrin qe do marri ne db
    public DbSet<User> Users { get; set; }
    public DbSet<Car_Image> Car_Images { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<User>()
        .HasMany(u => u.Cars)  
        .WithOne(c => c.User)
        .HasForeignKey(c => c.User_ID)
        .OnDelete(DeleteBehavior.Cascade);

        // Configure relationships
        modelBuilder.Entity<Cars_Sale>()
            .HasMany(c => c.Images)
            .WithOne(i => i.Car)
            .HasForeignKey(i => i.Car_ID)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

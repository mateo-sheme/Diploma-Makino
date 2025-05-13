using Project.Server.Entities;
using Microsoft.EntityFrameworkCore;
namespace Project.Server.Data;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
    {
        
    }

    public DbSet<Cars_Sale> Cars_Sale { get; set; } //Dbset <emri i klases qe deklarova> me emrin qe do marri ne db
    public DbSet<User> User { get; set; }
    public DbSet<Car_Image> Car_Images { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure relationships
        modelBuilder.Entity<Cars_Sale>()
            .HasMany(c => c.Images)
            .WithOne(i => i.Car)
            .HasForeignKey(i => i.Car_ID)
            .OnDelete(DeleteBehavior.Cascade);

        //modelBuilder.Entity<User>()
        //    .HasMany(s => s.Cars)
        //    .HasForeignKey(c => c.User_ID)
        //    .OnDelete(DeleteBehavior.Cascade);
    }
}

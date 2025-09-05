using Microsoft.EntityFrameworkCore;
using cs.Models;

namespace cs.Services
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Message> Messages { get; set; }
        
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Message>()
            .ToTable("notices")   // lowercase table
            .Property(m => m.Id).HasColumnName("id");          // lowercase column
        modelBuilder.Entity<Message>()
            .Property(m => m.Content).HasColumnName("content"); // lowercase column
    }

  }
}

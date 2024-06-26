
using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

public class DiplomaMakingContext : DbContext
{
    public DiplomaMakingContext(DbContextOptions<DiplomaMakingContext> options): base(options)
    {
    }


    public DbSet<Bootcamp> Bootcamp { get; set; } = default!;
    public DbSet<Diploma> Diploma { get; set; } = default!;
    public DbSet<Template> Template { get; set; } = default!;
    public DbSet<Style> styles { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bootcamp>()
            .HasIndex(bootcamp => bootcamp.Name)
            .IsUnique();

        base.OnModelCreating(modelBuilder);
    }

}

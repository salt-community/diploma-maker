
using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;

public class DiplomaMakingContext : DbContext
{
    public DiplomaMakingContext(DbContextOptions<DiplomaMakingContext> options) : base(options)
    {

    }

    public DbSet<Bootcamp> Bootcamps { get; set; } = default!;
    public DbSet<Student> Students { get; set; } = default!;
    public DbSet<DiplomaTemplate> DiplomaTemplates { get; set; } = default!;
    public DbSet<TemplateStyle> TemplateStyles { get; set; } = default!;
    public DbSet<Track> Tracks { get; set; } = default!;
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Track>()
            .HasIndex(Track => Track.Name)
            .IsUnique();
        
        base.OnModelCreating(modelBuilder);
    }

}

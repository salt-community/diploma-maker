
using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Models;
using DiplomaMakerApi.Dtos.UserFont;

namespace DiplomaMakerApi.Data;

public class DiplomaMakingContext(DbContextOptions<DiplomaMakingContext> options) : DbContext(options)
{
    public DbSet<Bootcamp> Bootcamps { get; set; } = default!;
    public DbSet<Student> Students { get; set; } = default!;
    public DbSet<DiplomaTemplate> DiplomaTemplates { get; set; } = default!;
    public DbSet<TemplateStyle> TemplateStyles { get; set; } = default!;
    public DbSet<DiplomaSnapshot> DiplomaSnapshots { get; set; } = default!;
    public DbSet<Track> Tracks { get; set; } = default!;
    public DbSet<UserFont> UserFonts { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Track>()
            .HasIndex(Track => Track.Name)
            .IsUnique();
        
        base.OnModelCreating(modelBuilder);
    }


}
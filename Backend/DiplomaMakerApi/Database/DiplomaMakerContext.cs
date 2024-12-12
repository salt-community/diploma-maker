using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Database;

public class DiplomaMakerContext(DbContextOptions<DiplomaMakerContext> options) : DbContext(options)
{
    public DbSet<Template> Templates { get; set; }
    public DbSet<DiplomaRecord> Diplomas { get; set; }
    public DbSet<Font> Fonts { get; set; } = default!;

    public void SeedData()
    {
        Database.EnsureDeleted();
        Database.EnsureCreated();
    }
}
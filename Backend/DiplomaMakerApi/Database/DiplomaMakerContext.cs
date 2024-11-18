using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Database;

public class DiplomaMakerContext(DbContextOptions<DiplomaMakerContext> options) : DbContext(options)
{
    public DbSet<Template> Templates { get; set; }
    public DbSet<Diploma> Diplomas { get; set; }

    public void SeedData()
    {
        Database.EnsureDeleted();
        Database.EnsureCreated();
    }
}
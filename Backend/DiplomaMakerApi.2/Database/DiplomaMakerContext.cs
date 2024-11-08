using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Database;

public class DiplomaMakerContext(DbContextOptions<DiplomaMakerContext> options) : DbContext(options)
{
    public DbSet<Bootcamp> Bootcamps { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Template> Templates { get; set; }
    public DbSet<Diploma> Diplomas { get; set; }
    public DbSet<Track> Tracks { get; set; }
    public DbSet<StringFile> StringFiles { get; set; }

    public void SeedData()
    {
        Database.EnsureDeleted();
        Database.EnsureCreated();
    }
}
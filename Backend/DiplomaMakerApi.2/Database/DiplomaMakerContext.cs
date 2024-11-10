using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi._2.Models;
using DiplomaMakerApi._2.Services;

namespace DiplomaMakerApi._2.Database;

public class DiplomaMakerContext(DbContextOptions<DiplomaMakerContext> options) : DbContext(options)
{
    public DbSet<Bootcamp> Bootcamps { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Template> Templates { get; set; }
    public DbSet<Diploma> Diplomas { get; set; }
    public DbSet<Track> Tracks { get; set; }
    public DbSet<StringFile> Files { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        /*
            Auto includes nested properties in entities. This is done 
            here so that the controllers don't have to specify these
            properties when getting entities from the database,
            allowing all of them to inherit their functionality from 
            CrudControllerBase.
        */

        modelBuilder.Entity<Diploma>()
            .Navigation(e => e.Student).AutoInclude();
        modelBuilder.Entity<Diploma>()
            .Navigation(e => e.Template).AutoInclude();
        modelBuilder.Entity<Diploma>()
            .Navigation(e => e.Bootcamp).AutoInclude();

        modelBuilder.Entity<Bootcamp>()
            .Navigation(e => e.Students).AutoInclude();
        modelBuilder.Entity<Bootcamp>()
            .Navigation(e => e.Track).AutoInclude();
    }

    public void SeedData()
    {
        Database.EnsureDeleted();
        Database.EnsureCreated();

        var tracks = MockerService.MockTracks(5);
        var students = MockerService.MockStudents(1);
        var templates = MockerService.MockTemplates(5);
        var stringFiles = MockerService.MockStringFiles(["application/pdf", "image/webp", "application/json"], 50);
        var bootcamps = MockerService.MockBootcamps(students, tracks, 1);
        var diplomas = MockerService.MockDiplomas(students, bootcamps, templates, 50);

        AddRange(tracks);
        AddRange(students);
        AddRange(templates);
        AddRange(stringFiles);
        AddRange(bootcamps);
        AddRange(diplomas);

        SaveChanges();
    }
}
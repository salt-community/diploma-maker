using Microsoft.EntityFrameworkCore;

using DiplomaMakerApi.Models;
using DiplomaMakerApi.Services;

namespace DiplomaMakerApi.Database;

public class DiplomaMakerContext(DbContextOptions<DiplomaMakerContext> options) : DbContext(options)
{
    public DbSet<Bootcamp> Bootcamps { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Template> Templates { get; set; }
    public DbSet<Diploma> Diplomas { get; set; }
    public DbSet<Track> Tracks { get; set; }
    public DbSet<StringFile> Files { get; set; }

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
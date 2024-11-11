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
        var trackGuids = tracks
            .Select(track => track.Guid)
            .ToList();

        var students = MockerService.MockStudents(1);
        var studentGuids = students
            .Select(student => student.Guid)
            .ToList();

        var templates = MockerService.MockTemplates(5);
        var templateGuids = templates
            .Select(template => template.Guid)
            .ToList();

        var stringFiles = MockerService.MockStringFiles(["application/pdf", "image/webp", "application/json"], 50);
        
        var bootcamps = MockerService.MockBootcamps(studentGuids, trackGuids, 1);
        var bootcampGuids = bootcamps
            .Select(bootcamp => bootcamp.Guid)
            .ToList();

        var diplomas = MockerService.MockDiplomas(studentGuids, bootcampGuids, templateGuids, 50);

        AddRange(tracks);
        AddRange(students);
        AddRange(templates);
        AddRange(stringFiles);
        AddRange(bootcamps);
        AddRange(diplomas);

        SaveChanges();
    }
}
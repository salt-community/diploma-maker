/*
    MockerService

    Provides methods to mock model entities, used for database seeding.
*/

using Bogus;
using DiplomaMakerApi._2.Models;

namespace DiplomaMakerApi._2.Services;

public static class MockerService
{
    private static T RandomElement<T>(List<T> set) =>
        set[Random.Shared.Next(set.Count())];

    private static List<T> RandomSubset<T>(List<T> set)
    {
        int count = Random.Shared.Next(set.Count);

        List<T> subset = [];
        while (subset.Count < count)
        {
            var randomElement = RandomElement(set);
            subset.Add(randomElement);
            set.Remove(randomElement);
        }

        return subset;
    }

    public static List<Track> MockTracks(int count) =>
        new Faker<Track>()
        .RuleFor(track => track.Name, f => f.Lorem.Words(1)[0])
            .Generate(count).ToList();

    public static List<Student> MockStudents(int count) =>
        new Faker<Student>()
            .RuleFor(student => student.Name, f => f.Person.Name)
            .RuleFor(student => student.Email, f => f.Person.Email)
            .Generate(count).ToList();

    public static List<Template> MockTemplates(int count) =>
        new Faker<Template>()
            .RuleFor(template => template.BasePdfGuid, f => Guid.NewGuid())
            .Generate(count).ToList();

    public static List<StringFile> MockStringFiles(List<string> fileTypes, int count) =>
        new Faker<StringFile>()
            .RuleFor(stringFile => stringFile.FileType, f => RandomElement(fileTypes))
            .RuleFor(stringFile => stringFile.Content, f => f.Image.Image())
            .Generate(count).ToList();

    public static List<Bootcamp> MockBootcamps(
        List<Student> students,
        List<Track> tracks,
        int count) =>
        new Faker<Bootcamp>()
            .RuleFor(bootcamp => bootcamp.Students, f => RandomSubset(students))
            .RuleFor(bootcamp => bootcamp.Track, f => RandomElement(tracks))
            .Generate(count).ToList();

    public static List<Diploma> MockDiplomas(
        List<Student> students,
        List<Bootcamp> bootcamps,
        List<Template> templates,
        int count) =>
        new Faker<Diploma>()
            .RuleFor(diploma => diploma.Student, f => RandomElement(students))
            .RuleFor(diploma => diploma.Bootcamp, f => RandomElement(bootcamps))
            .RuleFor(diploma => diploma.Template, f => RandomElement(templates))
            .Generate(count).ToList();
}
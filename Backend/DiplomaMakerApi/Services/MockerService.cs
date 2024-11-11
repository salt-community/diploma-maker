/*
    MockerService

    Provides methods to mock model entities, used for database seeding.
*/

using Bogus;

using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Services;

public static class MockerService
{
    private static T RandomElement<T>(List<T> set) =>
        set[Random.Shared.Next(set.Count)];

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
            .RuleFor(student => student.Name, f => f.Person.FullName)
            .RuleFor(student => student.Email, f => f.Person.Email)
            .Generate(count).ToList();

    public static List<Template> MockTemplates(int count) =>
        new Faker<Template>()
            .RuleFor(template => template.BasePdfGuid, f => Guid.NewGuid())
            .Generate(count).ToList();

    public static List<StringFile> MockStringFiles(List<string> fileTypes, int count) =>
        new Faker<StringFile>()
            .RuleFor(stringFile => stringFile.Name, f => f.Lorem.Word())
            .RuleFor(stringFile => stringFile.MimeType, f => RandomElement(fileTypes))
            .RuleFor(stringFile => stringFile.Content, f => f.Lorem.Paragraphs(50))
            .Generate(count).ToList();

    public static List<Bootcamp> MockBootcamps(
        List<Guid> studentGuids,
        List<Guid> trackGuids,
        int count) =>
        new Faker<Bootcamp>()
            .RuleFor(bootcamp => bootcamp.GraduationDate, f => f.Date.Between(new DateTime(2015, 1, 1), DateTime.Now))
            .RuleFor(bootcamp => bootcamp.StudentGuids, f => RandomSubset(studentGuids))
            .RuleFor(bootcamp => bootcamp.TrackGuid, f => RandomElement(trackGuids))
            .Generate(count).ToList();

    public static List<Diploma> MockDiplomas(
        List<Guid> studentGuids,
        List<Guid> bootcampGuids,
        List<Guid> templateGuids,
        int count) =>
        new Faker<Diploma>()
            .RuleFor(diploma => diploma.StudentGuid, f => RandomElement(studentGuids))
            .RuleFor(diploma => diploma.BootcampGuid, f => RandomElement(bootcampGuids))
            .RuleFor(diploma => diploma.TemplateGuid, f => RandomElement(templateGuids))
            .Generate(count).ToList();
}
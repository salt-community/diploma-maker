/*
    MockerService

    Provides methods to mock model entities, used for database seeding.
*/

using Bogus;
using DiplomaMakerApi.Database;
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

    public static void FullDiplomaSeed(DiplomaMakerContext context)
    {
        var templateFileGuid = Guid.Parse("a21b353e-60b6-42b5-b03a-ba23df76e236");
        var basePdfGuid = Guid.Parse("b21b353e-60b6-42b5-b03a-ba23df76e236");
        var templateGuid = Guid.Parse("c21b353e-60b6-42b5-b03a-ba23df76e236");
        var studentGuid = Guid.Parse("d21b353e-60b6-42b5-b03a-ba23df76e236");
        var trackGuid = Guid.Parse("e21b353e-60b6-42b5-b03a-ba23df76e236");
        var bootcampGuid = Guid.Parse("f21b353e-60b6-42b5-b03a-ba23df76e236");
        var diplomaGuid = Guid.Parse("a31b353e-60b6-42b5-b03a-ba23df76e236");

        var student = new Student()
        {
            Guid = studentGuid,
            Email = "hello@hello.hello",
            Name = "Hello Helloson"
        };

        var track = new Track()
        {
            Guid = trackGuid,
            Name = "CodingCamp"
        };

        var basePdfString = "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKErlCtfiyuMK5AIAXQ8GCgplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNTk1LjQ0IDg0MS45Ml0KL1Jlc291cmNlcyA8PAo+PgovQ29udGVudHMgNSAwIFIKL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzQgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL3RyYXBwZWQgKGZhbHNlKQovQ3JlYXRvciAoU2VyaWYgQWZmaW5pdHkgRGVzaWduZXIgMS4xMC40KQovVGl0bGUgKFVudGl0bGVkLnBkZikKL0NyZWF0aW9uRGF0ZSAoRDoyMDIyMDEwNjE0MDg1OCswOScwMCcpCi9Qcm9kdWNlciAoaUxvdmVQREYpCi9Nb2REYXRlIChEOjIwMjIwMTA2MDUwOTA5WikKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1NpemUgNwovUm9vdCAxIDAgUgovSW5mbyAzIDAgUgovSUQgWzwyODhCM0VENTAyOEU0MDcyNERBNzNCOUE0Nzk4OUEwQT4gPEY1RkJGNjg4NkVERDZBQUNBNDRCNEZDRjBBRDUxRDlDPl0KL1R5cGUgL1hSZWYKL1cgWzEgMiAyXQovRmlsdGVyIC9GbGF0ZURlY29kZQovSW5kZXggWzAgN10KL0xlbmd0aCAzNgo+PgpzdHJlYW0KeJxjYGD4/5+RUZmBgZHhFZBgDAGxakAEP5BgEmFgAABlRwQJCmVuZHN0cmVhbQplbmRvYmoKc3RhcnR4cmVmCjUzMgolJUVPRgo=";
        var templateFile = new StringFile()
        {
            Guid = templateFileGuid,
            Name = "TestDiplomaTemplate",
            MimeType = "application/json",
            Content =
            """{"schemas":[[{"name":"field1","type":"qrcode","content":"https://pdfme.com/","position":{"x":134.14,"y":57.36},"backgroundColor":"#ffffff","barColor":"#000000","width":30,"height":30,"rotate":0,"opacity":1,"required":false},{"name":"field2","type":"text","content":"afsjklfsöa {studentName}","position":{"x":38.1,"y":69.32},"width":45,"height":10,"rotate":0,"alignment":"left","verticalAlignment":"top","fontSize":13,"lineHeight":1,"characterSpacing":0,"fontColor":"#000000","backgroundColor":"","opacity":1,"strikethrough":false,"underline":false,"required":false}]],"basePdf":"data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PAovRmlsdGVyIC9GbGF0ZURlY29kZQovTGVuZ3RoIDM4Cj4+CnN0cmVhbQp4nCvkMlAwUDC1NNUzMVGwMDHUszRSKErlCtfiyuMK5AIAXQ8GCgplbmRzdHJlYW0KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL01lZGlhQm94IFswIDAgNTk1LjQ0IDg0MS45Ml0KL1Jlc291cmNlcyA8PAo+PgovQ29udGVudHMgNSAwIFIKL1BhcmVudCAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzQgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL3RyYXBwZWQgKGZhbHNlKQovQ3JlYXRvciAoU2VyaWYgQWZmaW5pdHkgRGVzaWduZXIgMS4xMC40KQovVGl0bGUgKFVudGl0bGVkLnBkZikKL0NyZWF0aW9uRGF0ZSAoRDoyMDIyMDEwNjE0MDg1OCswOScwMCcpCi9Qcm9kdWNlciAoaUxvdmVQREYpCi9Nb2REYXRlIChEOjIwMjIwMTA2MDUwOTA5WikKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1NpemUgNwovUm9vdCAxIDAgUgovSW5mbyAzIDAgUgovSUQgWzwyODhCM0VENTAyOEU0MDcyNERBNzNCOUE0Nzk4OUEwQT4gPEY1RkJGNjg4NkVERDZBQUNBNDRCNEZDRjBBRDUxRDlDPl0KL1R5cGUgL1hSZWYKL1cgWzEgMiAyXQovRmlsdGVyIC9GbGF0ZURlY29kZQovSW5kZXggWzAgN10KL0xlbmd0aCAzNgo+PgpzdHJlYW0KeJxjYGD4/5+RUZmBgZHhFZBgDAGxakAEP5BgEmFgAABlRwQJCmVuZHN0cmVhbQplbmRvYmoKc3RhcnR4cmVmCjUzMgolJUVPRgo=","pdfmeVersion":"5.0.0"}"""
        };

        var basePdf = new StringFile()
        {
            Guid = basePdfGuid,
            Name = "BasePdf",
            MimeType = "application/pdf",
            Content = basePdfString
        };

        var template = new Template()
        {
            Guid = templateGuid,
            BasePdfGuid = basePdfGuid
        };

        var bootcamp = new Bootcamp()
        {
            GraduationDate = DateTime.Now,
            StudentGuids = [studentGuid],
            TrackGuid = trackGuid
        };

        var diploma = new Diploma()
        {
            Guid = diplomaGuid,
            StudentGuid = studentGuid,
            BootcampGuid = bootcampGuid,
            TemplateGuid = templateGuid
        };

        context.Add(student);
        context.Add(track);
        context.Add(templateFile);
        context.Add(basePdf);
        context.Add(template);
        context.Add(bootcamp);
        context.Add(diploma);
        context.SaveChanges();
    }
}
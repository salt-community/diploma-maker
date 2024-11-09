/*
    Models

    The models used in the backend to form the database.
    Each derives from BaseEntity, which provides each with
    and Id, a Guid and the generic Patch method.

    Each property is nullable to generalize the Patch method,
    allowing an entity to be updated by the same entity type,
    skipping null values in the patch entity.

    The entities are sorted from least coupled to most.
*/

namespace DiplomaMakerApi._2.Models;

public class Track() : BaseEntity<Track>()
{
    public string? Name { get; set; } = string.Empty;
};

public class Student() : BaseEntity<Student>()
{
    public string? Name { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
}

public class StringFile() : BaseEntity<StringFile>()
{
    public string? FileType { get; set; } = string.Empty;
    public string? Content { get; set; } = string.Empty;
}

public class Template() : BaseEntity<Template>()
{
    public Guid? BasePdfGuid { get; set; } = null;
}

public class Bootcamp() : BaseEntity<Bootcamp>()
{
    public List<Student>? Students { get; set; } = [];
    public Track? Track { get; set; } = new();
};

public class Diploma() : BaseEntity<Diploma>()
{
    public Student? Student { get; set; } = new();
    public Bootcamp? Bootcamp { get; set; } = new();
    public Template? Template { get; set; } = new();
}
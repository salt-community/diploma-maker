/*
    Models

    The models used in the backend to form the database.
    Each derives from BaseEntity, which provides each with
    and Id, a Guid and the generic Patch method.

    Each property is nullable to generalize the Patch method,
    allowing an entity to be updated by the same entity type,
    skipping null values in the patch entity.

    All fields of the entities must be nullable in order for patching with
    the same entity type to work.
    TODO: Maybe use non-nullable entities instead, and replace the whole object except for Id and Guid
    (This has implications for the frontend, but might simplify things in the end)

    The entities are sorted from least coupled to most.
*/

using System.ComponentModel.DataAnnotations.Schema;

namespace DiplomaMakerApi.Models;

public class Track() : BaseEntity<Track>()
{
    public string? Name { get; set; }
};

public class Student() : BaseEntity<Student>()
{
    public string? Name { get; set; }
    public string? Email { get; set; }
}

public class StringFile() : BaseEntity<StringFile>()
{
    public string? Name { get; set; }
    public string? MimeType { get; set; }
    public string? Content { get; set; }
}

public class Template() : BaseEntity<Template>()
{
    public Guid? BasePdfGuid { get; set; }
}

public class Bootcamp() : BaseEntity<Bootcamp>()
{
    // Needed to store date in PostgreSQL, see: https://stackoverflow.com/questions/73693917/net-postgres-ef-core-cannot-write-datetime-with-kind-local-to-postgresql-type
    [Column(TypeName = "timestamp(6)")]
    public DateTime GraduationDate { get; set; }
    public List<Student>? Students { get; set; }
    public Track? Track { get; set; }
};

public class Diploma() : BaseEntity<Diploma>()
{
    public Student? Student { get; set; }
    public Bootcamp? Bootcamp { get; set; }
    public Template? Template { get; set; }
}
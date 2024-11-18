/*  
    Models

    The models used in the backend to form the database.
    Each derives from BaseEntity, which provides each with
    and Id, a Guid and the generic Patch method.

    Each property is nullable to generalize the Patch method,
    allowing an entity to be updated by the same entity type,
    skipping null values in the patch entity.
*/

using System.ComponentModel.DataAnnotations.Schema;

namespace DiplomaMakerApi.Models;

public class Track() : BaseEntity<Track>()
{
    public string Name { get; set; } = string.Empty;
};

public class Student() : BaseEntity<Student>()
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
};

public class StringFile() : BaseEntity<StringFile>()
{
    public string Name { get; set; } = string.Empty;
    public string MimeType { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
};

public class Template() : BaseEntity<Template>()
{
    public Guid? BasePdfGuid { get; set; }
    public Guid TemplateJsonFileGuid { get; set; }
};

public class Bootcamp() : BaseEntity<Bootcamp>()
{
    // Needed to store date in PostgreSQL, see: https://stackoverflow.com/questions/73693917/net-postgres-ef-core-cannot-write-datetime-with-kind-local-to-postgresql-type
    [Column(TypeName = "timestamp(6)")]
    public DateTime GraduationDate { get; set; }
    public List<Guid> StudentGuids { get; set; } = [];
    public Guid TrackGuid { get; set; }
};

public class Diploma() : BaseEntity<Diploma>()
{
    public Guid StudentGuid { get; set; }
    public Guid BootcampGuid { get; set; }
    public Guid TemplateGuid { get; set; }
};
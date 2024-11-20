/*  
    Models

    The models used in the backend to form the database.
    Each derives from BaseEntity, which provides each with
    and Id, a Guid and the generic Patch method.

    Each property is nullable to generalize the Patch method,
    allowing an entity to be updated by the same entity type,
    skipping null values in the patch entity.
*/

namespace DiplomaMakerApi.Models;

public class Template() : BaseEntity<Template>()
{
    public string Name { get; set; } = string.Empty;
    public string TemplateJson { get; set; } = string.Empty;
};

public class Diploma() : BaseEntity<Diploma>()
{
    public string StudentName { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public DateTime GraduationDate { get; set; }
    public Guid TemplateGuid { get; set; }
};

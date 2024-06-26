namespace DiplomaMakerApi.Models;

public class DiplomaRequestDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string StudentName { get; set; }
    public string? EmailAddress { get; set; }
    public required string BootcampGuidId {get; set;}
}

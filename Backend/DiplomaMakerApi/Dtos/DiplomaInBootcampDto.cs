namespace DiplomaMakerApi.Models;

public class DiplomaInBootcampDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string StudentName { get; set; }
    public required string EmailAddress { get; set; }
}

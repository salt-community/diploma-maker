namespace DiplomaMakerApi.Models;

public class StudentRequestDto
{
    public Guid? GuidId { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }

}
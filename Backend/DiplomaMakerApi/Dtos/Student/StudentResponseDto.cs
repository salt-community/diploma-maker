namespace DiplomaMakerApi.Models;

public class StudentResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Email { get; set; }
}

namespace Backend.Models;

public class DiplomaInBootcampDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string StudentName { get; set; }
    public required string Email { get; set; }
}

namespace Backend.Models;

public class DiplomaResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string StudentName { get; set; }
    public required string EmailAddress { get; set; }
    public required BootcampInDiplomaDto Bootcamp {get; set;}
}

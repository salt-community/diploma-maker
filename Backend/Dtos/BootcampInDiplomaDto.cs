namespace Backend.Models;

public class BootcampInDiplomaDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Email { get; set; }
    public DateTime graduationDate{ get; set; } = DateTime.Now.Date;

}
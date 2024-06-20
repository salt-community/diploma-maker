namespace Backend.Models;

public class BootcampRequestDto
{
    public required string Name { get; set; }
    public DateTime graduationDate{ get; set; } = DateTime.Now.Date;
}
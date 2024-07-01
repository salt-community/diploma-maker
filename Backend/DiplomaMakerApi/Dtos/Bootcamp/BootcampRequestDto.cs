namespace DiplomaMakerApi.Dtos;

public class BootcampRequestDto
{
    public required string Name { get; set; }
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;
}
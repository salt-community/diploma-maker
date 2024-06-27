namespace DiplomaMakerApi.Models;

public class BootcampResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;

    public required Template Template{ get; set; } 
    public List<DiplomaInBootcampDto> Diplomas { get; set; } = [];
}
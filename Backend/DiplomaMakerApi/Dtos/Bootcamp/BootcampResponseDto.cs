namespace DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
public class BootcampResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;

    public required DiplomaTemplate DiplomaTemplate { get; set; } 
    public required List<StudentResponseDto> Students { get; set; } 
}
namespace DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
public class BootcampResponseDto
{
    public required Guid GuidId { get; set; } 
    public required string Name { get; set; }
    public required DateTime GraduationDate{ get; set; } = DateTime.Now.Date;

    public required DiplomaTemplate DiplomaTemplate { get; set; } 
    public required List<StudentResponseDto> Students { get; set; } 
}
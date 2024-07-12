namespace DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
public class BootcampResponseDto
{
    public required Guid GuidId { get; set; } 
    public required string Name { get; set; }
    public required DateTime GraduationDate{ get; set; }

    public required int TemplateId { get; set; } 
    public required List<StudentResponseDto> Students { get; set; } 
}
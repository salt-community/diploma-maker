namespace DiplomaMakerApi.Models;

public class BootcampRequestUpdateDto
{
    public required List<StudentRequestDto> students { get; set; }

    public required int templateId { get; set; } 
    
}
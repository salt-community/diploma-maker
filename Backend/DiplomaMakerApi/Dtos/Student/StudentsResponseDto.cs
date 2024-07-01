namespace DiplomaMakerApi.Models;

public class StudentsResponseDto
{
    public required List<StudentResponseDto> Students { get; set; }
    public required Guid BootcampGuidId {get; set;}
}
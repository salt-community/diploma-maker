namespace DiplomaMakerApi.Models;

public class StudentsRequestDto
{
    public required List<StudentRequestDto> Students { get; set; }
    public required Guid BootcampGuidId {get; set;}
}
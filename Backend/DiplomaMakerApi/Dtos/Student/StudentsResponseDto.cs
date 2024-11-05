namespace DiplomaMakerApi.Dtos;

public class StudentsResponseDto
{
    public required List<StudentResponseDto> Students { get; set; }
    public required Guid BootcampGuid { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Dtos;

public class BootcampRequestUpdateDto
{
    [Required(ErrorMessage = "The students field is required.")]
    [MinLength(1, ErrorMessage = "At least one student must be provided.")]
    public required List<StudentRequestDto> Students { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "TemplateId must be a positive number.")]
    public required int TemplateId { get; set; }

    [Range(1, 3, ErrorMessage = "TrackId must be between 1 and 3.")]
    public required int TrackId { get; set; }

    public required DateTime GraduationDate { get; set; }
}
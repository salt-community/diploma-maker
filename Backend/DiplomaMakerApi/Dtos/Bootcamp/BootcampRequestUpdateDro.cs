using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Models;

public class BootcampRequestUpdateDto
{
    [Required(ErrorMessage = "The students field is required.")]
    [MinLength(1, ErrorMessage = "At least one student must be provided.")]
    public required List<StudentRequestDto> students { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "TemplateId must be a positive number.")]
    public required int templateId { get; set; }
}
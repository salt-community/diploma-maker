using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Models;

public class StudentRequestDto
{
    public Guid? GuidId { get; set; }

    [Required(ErrorMessage = "VerificationCode is required.")]
    public required string VerificationCode { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    public required string Name { get; set; }
    public string? Email { get; set; }
}
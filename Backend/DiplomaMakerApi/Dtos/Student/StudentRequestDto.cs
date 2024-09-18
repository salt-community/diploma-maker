using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Models;

public class StudentRequestDto
{
    public Guid? GuidId { get; set; }

    [Required(ErrorMessage = "VerificationCode is required.")]
    [MinLength(6, ErrorMessage = "VerificationCode must be at least 6 characters long.")]
    public required string VerificationCode { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    public required string Name { get; set; }

    [EmailAddress(ErrorMessage = "The Email field is not a valid e-mail address.")]
    public string? Email { get; set; }
}
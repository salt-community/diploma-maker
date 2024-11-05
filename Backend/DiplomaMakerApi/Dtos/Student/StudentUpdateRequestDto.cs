using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Dtos;

public class StudentUpdateRequestDto
{
    [MinLength(1, ErrorMessage = "Name cannot be empty")]
    public required string Name { get; set; }

    [MinLength(1, ErrorMessage = "Email cannot be empty")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; set; }
}

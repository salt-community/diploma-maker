using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Models;

public class TemplatePostRequestDto
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "The templateName field is required and cannot be empty.")]
    [DataType(DataType.Text, ErrorMessage = "The field templateName must be a string.")]
    [MinLength(1, ErrorMessage = "The templateName field must have at least 1 character.")]
    [MaxLength(12, ErrorMessage = "The templateName cannot exceed 12 characters.")]
    public required string templateName {get; set;} 
}
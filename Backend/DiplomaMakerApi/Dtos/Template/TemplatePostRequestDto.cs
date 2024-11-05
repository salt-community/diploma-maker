using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Dtos;

public class TemplatePostRequestDto
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "The templateName field is required and cannot be empty.")]
    [DataType(DataType.Text, ErrorMessage = "The field templateName must be a string.")]
    public required string TemplateName { get; set; }
}
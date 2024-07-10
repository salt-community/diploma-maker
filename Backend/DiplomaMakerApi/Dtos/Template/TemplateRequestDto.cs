namespace DiplomaMakerApi.Models;

public class TemplateRequestDto
{
    public required string templateName {get; set;} 

    public required string footer {get; set;}
    public TemplateStyle? footerStyling {get; set;}

    public required string intro {get; set;}
    public TemplateStyle? introStyling { get; set; }

    public required string main {get; set;}
    public TemplateStyle? mainStyling { get; set; }

    public required IFormFile basePdf { get; set;}
}
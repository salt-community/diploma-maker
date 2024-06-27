namespace DiplomaMakerApi.Models;

public class TemplateResponseDto
{
    public required int Id { get; set;}

    public required string templateName {get; set;} 

    public required string footer {get; set;}
    public Style? footerStyling {get; set;}

    public required string intro {get; set;}
    public Style? introStyling { get; set; }

    public required string main {get; set;}
    public Style? mainStyling { get; set; }

    public required string basePdf { get; set;}
}
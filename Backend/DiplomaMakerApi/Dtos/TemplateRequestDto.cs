namespace DiplomaMakerApi.Models;

public class TemplateRequestDto
{
    public required string templateName {get; set;} 

    public required string footer {get; set;}

    public required string intro {get; set;}

    public required string main {get; set;}

    public required string basePdf { get; set;}
}
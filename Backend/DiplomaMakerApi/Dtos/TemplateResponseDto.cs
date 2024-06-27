namespace DiplomaMakerApi.Models;

public class TemplateResponseDto
{
    public required int Id { get; set;}

    public required string templateName {get; set;} 

    public required string footer {get; set;}

    public required string intro {get; set;}

    public required string main {get; set;}

    public required string basePdf { get; set;}
}
namespace Backend.Models;

public class TemplateResponseDto
{
    public required int Id { get; set;}

    public required string templateName {get; set;} 

    public required string footer {get; set;}

    public required string intro {get; set;}

    public required string studentName {get; set;}

    public required string basePdf { get; set;}
}
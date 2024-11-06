namespace DiplomaMakerApi.Dtos;

public class TemplateFieldStyleDto
{
    public int Id { get; set; }
    public double? XPos { get; set; }
    public double? YPos { get; set; }
    public double? Width { get; set; }
    public double? Height { get; set; }
    public double? FontSize { get; set; }
    public string? FontColor { get; set; }
    public string? FontName { get; set; }
    public string? Alignment { get; set; }
}
namespace DiplomaMakerApi.Models;
public class TemplateStyle
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

    public static TemplateStyle DefaultFooter = new()
    {
        XPos = 0,
        YPos = 0,
        Width = 0,
        Height = 0,
        FontSize = 0,
        FontColor = "black",
        FontName = "arial",
        Alignment = "center"
    };

    public static TemplateStyle DefaultIntro = new()
    {
        XPos = 0,
        YPos = 0,
        Width = 0,
        Height = 0,
        FontSize = 0,
        FontColor = "black",
        FontName = "arial",
        Alignment = "center"
    };

    public static TemplateStyle DefaultMain = new()
    {
        XPos = 0,
        YPos = 0,
        Width = 0,
        Height = 0,
        FontSize = 0,
        FontColor = "black",
        FontName = "arial",
        Alignment = "center"
    };

    public static TemplateStyle DefaultLink = new()
    {
        XPos = 0,
        YPos = 0,
        Width = 0,
        Height = 0,
        FontSize = 0,
        FontColor = "black",
        FontName = "arial",
        Alignment = "center"
    };
}
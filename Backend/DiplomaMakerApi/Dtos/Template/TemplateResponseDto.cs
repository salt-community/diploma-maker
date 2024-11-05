using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos;

public class TemplateResponseDto
{
    public required int Id { get; set; }

    public required string Name { get; set; }

    public required string Footer { get; set; }
    public TemplateStyle? FooterStyling { get; set; }

    public required string Intro { get; set; }
    public TemplateStyle? IntroStyling { get; set; }

    public required string Main { get; set; }
    public TemplateStyle? MainStyling { get; set; }

    public required string Link { get; set; }
    public TemplateStyle? LinkStyling { get; set; }

    public required string BasePdf { get; set; }
    public DateTime LastUpdated { get; set; }
    public DateTime PdfBackgroundLastUpdated { get; set; }
}
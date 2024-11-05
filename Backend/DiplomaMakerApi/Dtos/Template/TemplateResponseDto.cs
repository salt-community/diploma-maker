namespace DiplomaMakerApi.Dtos;

public class TemplateResponseDto
{
    public required int Id { get; set; }

    public required string TemplateName { get; set; }

    public required string Footer { get; set; }
    public TemplateFieldStyleDto? FooterStyling { get; set; }

    public required string Intro { get; set; }
    public TemplateFieldStyleDto? IntroStyling { get; set; }

    public required string Main { get; set; }
    public TemplateFieldStyleDto? MainStyling { get; set; }

    public required string Link { get; set; }
    public TemplateFieldStyleDto? LinkStyling { get; set; }

    public required string BasePdf { get; set; }
    public DateTime LastUpdated { get; set; }
    public DateTime PdfBackgroundLastUpdated { get; set; }
}
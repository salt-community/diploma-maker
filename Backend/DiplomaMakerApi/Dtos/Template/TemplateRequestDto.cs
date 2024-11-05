using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos;

public class TemplateRequestDto
{
    public required string templateName { get; set; }

    public required string footer { get; set; }
    public TemplateStyle? footerStyling { get; set; }

    public required string intro { get; set; }
    public TemplateStyle? introStyling { get; set; }

    public required string main { get; set; }
    public TemplateStyle? mainStyling { get; set; }

    public required string Link { get; set; }
    public TemplateStyle? LinkStyling { get; set; }

    public required string basePdf { get; set; }
    public DateTime? PdfBackgroundLastUpdated { get; set; }
}
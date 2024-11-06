namespace DiplomaMakerApi.Models;

public class DiplomaTemplate
{
    public DiplomaTemplate() { }
    public int Id { get; set; }
    public required string Name { get; set; }
    public string Footer { get; set; } = "has successfully completed\nthe {classname} Bootcamp of \n {datebootcamp} at School of Applied Technology.";
    public TemplateStyle? FooterStyling { get; set; } = TemplateStyle.DefaultFooter;
    public string Intro { get; set; } = "This certifies that\n";
    public TemplateStyle? IntroStyling { get; set; } = TemplateStyle.DefaultIntro;
    public string Main { get; set; } = "{studentname}";
    public TemplateStyle? MainStyling { get; set; } = TemplateStyle.DefaultMain;
    public string Link { get; set; } = "{id}";
    public TemplateStyle? LinkStyling { get; set; } = TemplateStyle.DefaultLink;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    public DateTime? PdfBackgroundLastUpdated { get; set; } = DateTime.UtcNow;
}
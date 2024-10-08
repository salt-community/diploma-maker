namespace DiplomaMakerApi.Models;

public class DiplomaTemplate
{
    private readonly IConfiguration? _configuration;
    public DiplomaTemplate() {}
    public DiplomaTemplate(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public int Id { get; set;}
    public required string Name {get; set;} 
    public string Footer {get; set;} = "has successfully completed\nthe {classname} Bootcamp of \n {datebootcamp} at School of Applied Technology.";
    public TemplateStyle? FooterStyling {get; set;}
    public string Intro {get; set;} = "This certifies that\n";
    public TemplateStyle? IntroStyling { get; set; }
    public string Main {get; set;} =  "{studentname}";
    public TemplateStyle? MainStyling { get; set; }
    public string Link { get; set; } = "{id}";
    public TemplateStyle? LinkStyling { get; set; }
    public string BasePdf => Path.Combine(_configuration?["Blob:BlobStorageFolder"] ?? "Blob", Name + ".pdf").Replace("\\", "/");
    public DateTime LastUpdated {get; set;} = DateTime.UtcNow;
    public DateTime? PdfBackgroundLastUpdated {get; set;} = DateTime.UtcNow;
} 
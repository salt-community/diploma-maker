namespace DiplomaMakerApi.Models;

public class DiplomaTemplate
{
    public int Id { get; set;}

    public required string Name {get; set;} 

    public string Footer {get; set;} = "has successfully completed\nthe {classname} Bootcamp of \n {datebootcamp} at School of Applied Technology.";
    public TemplateStyle? FooterStyling {get; set;}

    public string Intro {get; set;} = "This certifies that\n";
    public TemplateStyle? IntroStyling { get; set; }

    public string Main {get; set;} =  "{studentname}";
    public TemplateStyle? MainStyling { get; set; }
    public string BasePdf => Path.Combine("Blob", Name + ".pdf").Replace("\\", "/");
    public DateTime LastUpdated {get; set;}
} 
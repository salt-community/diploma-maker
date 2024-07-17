namespace DiplomaMakerApi.Models
{
    public class DiplomaGenerationLog
    {
        public int Id { get; set; }
        public required DateTime GeneratedAt { get; set; }
        public required string BootcampName { get; set; }
        public required DateTime BootcampGraduationDate { get; set; }
        public Guid? StudentGuidId { get; set; }
        public required string StudentName { get; set; }
        public required string VerificationCode { get; set; }
        public required string TemplateName { get; set; }
        public required string Footer {get; set;}
        public TemplateStyle? FooterStyling {get; set;}
        public required string Intro {get; set;}
        public TemplateStyle? IntroStyling {get; set;}
        public required string Main {get; set;}
        public TemplateStyle? MainStyling {get; set;}
        public required string Link { get; set; }
        public TemplateStyle? LinkStyling { get; set; }
        public required string BasePdf { get; set; }
        public DateTime TemplateLastUpdated {get; set;}
    }
}
namespace DiplomaMakerApi.Dto;

public class SendEmailRequest
{
    public string MessageHtml { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
    public string DiplomaPdfBase64 { get; set; } = string.Empty;
}
namespace DiplomaMakerApi.Dto;

public class SendEmailRequest
{
    public string MessageHtml { get; set; } = string.Empty;
    public string StudenEmail { get; set; } = string.Empty;
    public string DiplomaPdfBase64 { get; set; } = string.Empty;
}
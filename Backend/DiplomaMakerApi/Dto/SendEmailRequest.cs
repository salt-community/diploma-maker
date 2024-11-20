namespace DiplomaMakerApi.Dto;

public class SendEmailRequest
{
    public string StudenEmail { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string DiplomaPdfBase64 { get; set; } = string.Empty;
}
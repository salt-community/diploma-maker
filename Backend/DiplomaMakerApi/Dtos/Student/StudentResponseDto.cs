namespace DiplomaMakerApi.Models;

public class StudentResponseDto
{
    public required Guid GuidId { get; set; } 
    public required string VerificationCode { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? PreviewImageLQIPUrl { get; set; }
    public DateTime? LastGenerated { get; set; }
}

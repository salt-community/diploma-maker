namespace DiplomaMakerApi.Dtos;

public class StudentResponseDto
{
    public required Guid Guid { get; set; }
    public required string VerificationCode { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? PreviewImageUrl { get; set; }
    public string? PreviewImageLQIPUrl { get; set; }
    public DateTime? LastGenerated { get; set; }
}

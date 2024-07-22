using System.Text.Json.Serialization;
namespace DiplomaMakerApi.Models;

public class Student
{
    public int Id { get; set; }
    public Guid? GuidId { get; set; } = Guid.NewGuid();
    public required string VerificationCode { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }
    public DateTime? LastGenerated { get; set; }
    [JsonIgnore]
    public required Bootcamp Bootcamp {get; set;}
}

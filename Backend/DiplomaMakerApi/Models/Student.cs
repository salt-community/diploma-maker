using System.Text.Json.Serialization;
namespace DiplomaMakerApi.Models;

public class Student
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public string? Email { get; set; }
    [JsonIgnore]
    public Bootcamp Bootcamp {get; set;}
}

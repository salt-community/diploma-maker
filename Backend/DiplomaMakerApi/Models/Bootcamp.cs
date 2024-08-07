using System.Text.Json.Serialization;

namespace DiplomaMakerApi.Models;


public class Bootcamp
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public DateTime GraduationDate { get; set; } = DateTime.UtcNow;
    public List<Student> Students { get; set; } = new List<Student>();
    public required DiplomaTemplate DiplomaTemplate { get; set; } 
    [JsonIgnore]
    public required Track Track { get; set; }
    public string Name
    {
        get
        {
             return $"{Track.Tag ?? Track.Name}-{GraduationDate:yyyy-MM-dd}";
        }
    }

}
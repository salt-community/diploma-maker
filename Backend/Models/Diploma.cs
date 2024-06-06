using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;
    public required string StudentName { get; set; }
    [JsonIgnore]
    public Bootcamp Bootcamp {get; set;}
}

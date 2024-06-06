using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();

    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
    public DateTime GraduationDate{ get; set; }
    public required string StudentName { get; set; }
    [JsonIgnore]
    public Bootcamp Bootcamp {get; set;}
}

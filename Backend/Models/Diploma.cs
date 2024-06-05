using System.ComponentModel.DataAnnotations;
using System.Drawing;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string BootcampName{ get; set; }
    
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
    public DateTime GraduationDate{ get; set; }
    public required string StudentName { get; set; }
}

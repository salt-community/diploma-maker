using System.ComponentModel.DataAnnotations;
using System.Drawing;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string BootcampName{ get; set; }
    public DateTime Date{ get; set; }
    public required string StudentName { get; set; }
}

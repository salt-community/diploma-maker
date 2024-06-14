using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampRequestDto
{
    public required string Name { get; set; }
    public DateTime StartDate{ get; set; } = DateTime.Now.Date;
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;
}
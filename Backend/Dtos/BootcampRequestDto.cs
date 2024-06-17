using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampRequestDto
{
    public required string Name { get; set; }
    public DateTime CourseDate{ get; set; } = DateTime.Now.Date;
}
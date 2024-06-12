using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime StartDate{ get; set; } = DateTime.Now.Date;   
    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date; 
    public List<Diploma> Diplomas { get; set; } = [];
}
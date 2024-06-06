using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampInDiplomaDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime StartDate{ get; set; } = DateTime.Now.Date;
}
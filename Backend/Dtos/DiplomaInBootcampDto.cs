using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class DiplomaInBootcampDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string StudentName { get; set; }
}

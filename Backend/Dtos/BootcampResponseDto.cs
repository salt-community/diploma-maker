using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime graduationDate{ get; set; } = DateTime.Now.Date;

    public Template template{ get; set; } 
    public List<DiplomaInBootcampDto> Diplomas { get; set; } = [];
}
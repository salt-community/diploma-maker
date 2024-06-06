using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime StartDate{ get; set; } = DateTime.Now.Date;

    public List<DiplomaResponseDto> Diplomas { get; set; } = [];
}
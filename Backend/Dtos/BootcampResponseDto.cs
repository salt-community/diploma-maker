using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public string StartDate { get; set; } = DateTime.Now.ToString("MM/dd/yyyy");

    public List<DiplomaResponseDto> Diplomas { get; set; } = [];
}
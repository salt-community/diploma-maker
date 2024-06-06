using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class DiplomaRequestDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();

    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;
    public required string StudentName { get; set; }
    public required string BootcampGuidId {get; set;}
}

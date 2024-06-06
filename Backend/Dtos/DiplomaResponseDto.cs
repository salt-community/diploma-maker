using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class DiplomaResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();

    public DateTime GraduationDate{ get; set; } = DateTime.Now.Date;
    public required string StudentName { get; set; }
    public required BootcampInDiplomaDto Bootcamp {get; set;}
}

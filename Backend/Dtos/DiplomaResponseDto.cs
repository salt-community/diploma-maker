using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class DiplomaResponseDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();

    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
    public DateTime GraduationDate{ get; set; }
    public required string StudentName { get; set; }
    public required Guid BootcampGuidId {get; set;}
}

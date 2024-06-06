using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampRequestDto
{
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    [DataType(DataType.Date)]
    [DisplayFormat(DataFormatString = "{0:dd/MM/yyyy}", ApplyFormatInEditMode = true)]
    public DateTime StartDate { get; set; }
}
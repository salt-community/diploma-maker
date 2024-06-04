using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class BootcampClass
{
    public int Id { get; set; }
    public required string Name { get; set; }

    public List<Diploma> Diplomas { get; set; } = [];

}
using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime StartDate{ get; set; }
    public List<Diploma> Diplomas { get; set; } = [];

}
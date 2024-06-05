using System.ComponentModel.DataAnnotations;
using System.Drawing;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public required string BootcampName{ get; set; }
    public required string StudentName { get; set; }
}

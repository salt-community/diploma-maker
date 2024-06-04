using System.ComponentModel.DataAnnotations;
using System.Drawing;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public required string ClassName{ get; set; }
    public DateTime Date{ get; set; }
    public required string StudentName { get; set; }
    public required Image image{ get; set; }
}
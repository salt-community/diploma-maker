using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class Diploma
{
    public int Id { get; set; }
    public required string ClassName{ get; set; }
    public DateTime Date{ get; set; }
    public required string StudentName { get; set; }
}
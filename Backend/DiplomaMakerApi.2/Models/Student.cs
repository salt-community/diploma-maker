namespace DiplomaMakerApi._2.Models;

public class Student
{
    public int Id { get; set; }
    public Guid Guid { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public required string Email { get; set; }
}

namespace DiplomaMakerApi._2.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public Guid Guid { get; set; } = Guid.NewGuid();
    public List<Student> Students { get; set; } = [];
    public required Track Track { get; set; }
}
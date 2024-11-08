namespace DiplomaMakerApi._2.Models;

public class Bootcamp : BaseEntity
{
    public List<Student> Students { get; set; } = [];
    public required Track Track { get; set; }
}
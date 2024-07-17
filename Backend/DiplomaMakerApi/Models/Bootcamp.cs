namespace DiplomaMakerApi.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required Track Track { get; set; }
    public DateTime GraduationDate { get; set; } = DateTime.UtcNow;
    public List<Student> Students { get; set; } = [];
    public required DiplomaTemplate DiplomaTemplate { get; set; } 

}
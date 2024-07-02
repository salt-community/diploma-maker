namespace DiplomaMakerApi.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime GraduationDate { get; set; } = DateTime.Now;
    public List<Student> Students { get; set; } = [];
    public required DiplomaTemplate DiplomaTemplate { get; set; } 

}
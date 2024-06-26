namespace DiplomaMakerApi.Models;

public class Bootcamp
{
    public int Id { get; set; }
    public Guid GuidId { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime graduationDate {get; set; } = DateTime.Now;
    public List<Diploma> Diplomas { get; set; } = [];
    public required Template template { get; set;} 
    
    }
namespace DiplomaMakerApi.Models;

public class Track
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Tag { get; set;}
    public List<Bootcamp> Bootcamps { get; set; } = new List<Bootcamp>();
}


namespace DiplomaMakerApi._2.Models;

public class Diploma
{
    public int Id { get; set; }
    public Guid Guid { get; set; } = Guid.NewGuid();
    public required Student Student { get; set; }
    public required Bootcamp Bootcamp { get; set; }
    public required Template Template { get; set; }
}

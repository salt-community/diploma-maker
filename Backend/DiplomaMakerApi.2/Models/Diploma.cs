namespace DiplomaMakerApi._2.Models;

public class Diploma : BaseEntity
{
    public required Student Student { get; set; }
    public required Bootcamp Bootcamp { get; set; }
    public required Template Template { get; set; }
}

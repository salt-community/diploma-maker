namespace DiplomaMakerApi._2.Models;

public class BaseEntity
{
    public int Id { get; set; }
    public Guid Guid { get; set; } = Guid.NewGuid();
}
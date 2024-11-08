namespace DiplomaMakerApi._2.Models;

public class Template
{
    public int Id { get; set; }
    public Guid Guid { get; set; } = Guid.NewGuid();
    public Guid? BasePdfGuid { get; set; } = null;
}

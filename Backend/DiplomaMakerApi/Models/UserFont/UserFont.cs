namespace DiplomaMakerApi.Models;

public class UserFont
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required FontType FontType { get; set; }
    public string FileName => FontType == FontType.regular
        ? Name
        : $"{Name}-{FontType}";
}
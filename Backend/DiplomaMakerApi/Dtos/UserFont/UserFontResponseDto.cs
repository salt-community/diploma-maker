using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos;

public class UserFontResponseDto
{
    public required string Name { get; set; }
    public required FontType FontType { get; set; }
    public string FileName => FontType == FontType.regular 
        ? Name 
        : $"{Name}-{FontType}";
}
namespace DiplomaMakerApi.Dtos;

using DiplomaMakerApi.Models;

public class TracksResponseDto
{
   public int Id { get; set; }
    public required string Name { get; set; }
    public string? Tag { get; set;}
    public required List<BootcampResponseDto> Bootcamps { get; set; } 
}
using DiplomaMakerApi.Models;
namespace DiplomaMakerApi.Dtos;

public class BootcampRequestDto
{
    public required int TrackId { get; set; }
    public required DateTime GraduationDate { get; set; } 
}
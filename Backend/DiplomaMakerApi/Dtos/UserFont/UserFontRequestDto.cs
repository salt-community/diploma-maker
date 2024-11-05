using System.ComponentModel.DataAnnotations;

using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos;

public class UserFontRequestDto
{
    [Required(ErrorMessage = "The Name field is required.")]
    public required string Name { get; set; }

    [Required(ErrorMessage = "The FontType field is required.")]
    public required FontType FontType { get; set; }

    [Required(ErrorMessage = "The File field is required.")]
    public IFormFile? File { get; set; }

    public string FileName => FontType == FontType.regular 
        ? Name 
        : $"{Name}-{FontType}.woff";
}
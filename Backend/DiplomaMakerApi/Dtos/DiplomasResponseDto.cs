using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos
{
    public class DiplomasResponseDto
    {
        public List<DiplomaResponseDto> Diplomas { get; set; } = new List<DiplomaResponseDto>();
    }
}
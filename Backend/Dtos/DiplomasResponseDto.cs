using Backend.Models;

namespace Backend.Dtos
{
    public class DiplomasResponseDto
    {
        public List<DiplomaResponseDto> Diplomas { get; set; } = new List<DiplomaResponseDto>();
    }
}
using Backend.Models;

namespace Backend.Dtos
{
    public class DiplomasRequestDto
    {
        public List<DiplomaRequestDto> Diplomas { get; set; } = new List<DiplomaRequestDto>();
    }
}
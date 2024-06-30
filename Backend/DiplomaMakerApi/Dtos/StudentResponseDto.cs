using DiplomaMakerApi.Models;

namespace DiplomaMakerApi.Dtos;

    public class StudentResponseDto
    {
        public List<StudentResponseDto> Students { get; set; } = new List<StudentResponseDto>();
    }

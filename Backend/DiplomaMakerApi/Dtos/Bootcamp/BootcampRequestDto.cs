using System.ComponentModel.DataAnnotations;

namespace DiplomaMakerApi.Dtos
{
    public class BootcampRequestDto
    {
        [Range(1, 3, ErrorMessage = "TrackId must be between 1 and 3.")]
        public required int TrackId { get; set; }
        public required DateTime GraduationDate { get; set; }
    }
}
namespace DiplomaMakerApi.Dtos.Diploma
{
    public class DiplomaPutRequestDto
    {
        public required Guid StudentGuidId { get; set; }
        public required string ImageData { get; set; }
    }
}
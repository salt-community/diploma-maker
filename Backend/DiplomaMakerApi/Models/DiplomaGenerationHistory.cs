namespace DiplomaMakerApi.Models
{
    public class DiplomaGenerationHistory
    {
        public int Id { get; set; }
        public DateTime GeneratedAt { get; set; }
        public required Bootcamp Bootcamps { get; set; }
    }
}
namespace DiplomaMakerApi.Dtos.PreviewImage
{
    public class PreviewImageRequestDto
    {
        public required Guid StudentGuidId { get; set; }
        public required byte[] Image { get; set; }
    }
}
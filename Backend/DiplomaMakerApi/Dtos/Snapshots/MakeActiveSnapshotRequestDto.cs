namespace DiplomaMakerApi.Models
{
    public class MakeActiveSnapshotRequestDto
    {
        public required int[] Ids { get; set; }
        public Guid[]? StudentGuidIds { get; set; }
    }
}
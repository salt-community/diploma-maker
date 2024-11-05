namespace DiplomaMakerApi.Dtos;

public class MakeSnapshotActiveRequestDto
{
    public required int[] Ids { get; set; }
    public Guid[]? StudentGuidIds { get; set; }
}
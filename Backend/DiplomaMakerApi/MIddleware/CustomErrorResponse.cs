namespace DiplomaMakerApi.MIddleware;

public class CustomErrorResponse
{
    public required int Status { get; set; }
    public required string Message { get; set; }
}
namespace DiplomaMakerApi.Dtos;

public class SendEmailRequest
{
        public required IFormFile File { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }

}
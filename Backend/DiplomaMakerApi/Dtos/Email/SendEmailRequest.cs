namespace DiplomaMakerApi.Models;


public class SendEmailRequest {
        public required IFormFile File { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }

}
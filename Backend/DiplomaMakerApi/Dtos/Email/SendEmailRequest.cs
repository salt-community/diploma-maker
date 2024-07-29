namespace DiplomaMakerApi.Models;


public class SendEmailRequest {

    public required IFormFile File;
    public required string email;
    public required string password;
}
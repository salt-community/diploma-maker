namespace DiplomaMakerApi.Services;
using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;


public class EmailService
{
    private readonly string _email;
    private readonly string _appPassword;
    private readonly DiplomaMakingContext _context;

    public EmailService(IConfiguration configuration, IWebHostEnvironment env, ILogger<EmailService> logger, DiplomaMakingContext context)
    {
        if (env.IsDevelopment())
        {
            _email = configuration["EmailSettings:Email"] ?? throw new ArgumentNullException(nameof(_email));
            _appPassword = configuration["EmailSettings:AppPassword"] ?? throw new ArgumentNullException(nameof(_appPassword));
        }
        else
        {
            _email = Environment.GetEnvironmentVariable("Email") ?? throw new ArgumentNullException(nameof(_email));
            _appPassword = Environment.GetEnvironmentVariable("AppPassword") ?? throw new ArgumentNullException(nameof(_appPassword));
        }

  
        _context = context;
    }

    public async Task SendEmailWithAttachmentAsync(Guid guidid, IFormFile file, string email, string password)
    {
        var diplomaByGuid = await _context.Students.FirstOrDefaultAsync(d => d.GuidId == guidid);

        if (diplomaByGuid == null)
        {
          
            throw new ArgumentException("Invalid guid");
        }

        if (diplomaByGuid.Email == null || email == null)
        {
            throw new ArgumentException("The user have no email set for them");
        }

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("DiplomaMakers", email));
        message.To.Add(new MailboxAddress("Salt Graduate", diplomaByGuid.Email));
        message.Subject = "Salt Diploma";

        var multipart = new Multipart("mixed");

        var body = new TextPart("html")
        {
            Text =
            $"<h1>Congratulations, {diplomaByGuid.Name}! 🎉</h1><p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>"
        };
        multipart.Add(body);

        try
        {
            var attachment = new MimePart(file.ContentType)
            {
                Content = new MimeContent(file.OpenReadStream(), ContentEncoding.Default),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = $"Diploma-{diplomaByGuid.Name}.pdf"
            };
            multipart.Add(attachment);
        }
        catch (Exception ex)
        {

            throw new ArgumentException("FileContent is of the wrong format");
        }

        message.Body = multipart;

        using (var client = new SmtpClient())
        {
            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(email, password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}


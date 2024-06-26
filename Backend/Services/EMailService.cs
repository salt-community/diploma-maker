using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Services
{
    public class EmailService
    {
        private readonly string _email;
        private readonly string _appPassword;
        private readonly ILogger<EmailService> _logger;
        private readonly DiplomaMakingContext _context;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger, DiplomaMakingContext context)
        {
            _email = configuration["EmailSettings:Email"];
            _appPassword = configuration["EmailSettings:AppPassword"]; 
            _logger = logger;
            _context = context;
            
        }
        public async Task SendEmailWithAttachmentAsync([FromForm] string receiverEmail, IFormFile file)
        {
            //check if valid email

            // check if valid file

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("DiplomaMakers", _email));
            message.To.Add(new MailboxAddress("Salt Graduate", receiverEmail));
            message.Subject = "Salt Diploma";

            var multipart = new Multipart("mixed");
      
            var body = new TextPart("html")
            {
                Text = $"<html><body><h1>Congratulations!🎉</h1><p>Well done on completing the bootcamp.</p></body></html>"
            };
            multipart.Add(body);

            var attachment = new MimePart(file.ContentType)
            {
                Content = new MimeContent(file.OpenReadStream(), ContentEncoding.Default),
                ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                ContentTransferEncoding = ContentEncoding.Base64,
                FileName = file.FileName
            };
            multipart.Add(attachment);

            message.Body = multipart;

            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(_email, _appPassword); 
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while sending email.");
                }
            }
        }
        
    }
}

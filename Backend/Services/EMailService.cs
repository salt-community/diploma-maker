using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;


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
        public async Task SendEmailWithAttachmentAsync(Guid guidid, IFormFile file)
        {
            var diplomaByGuid = await _context.Diploma.FirstOrDefaultAsync(d => d.GuidId == guidid);

            if (diplomaByGuid == null)
            {
                _logger.LogError("Invalid GUID: {GuidId}", guidid);
                throw new ArgumentException("Invalid guid");
            }

            if (diplomaByGuid.EmailAddress == null)
            {
                _logger.LogError("Invalid email address.");
                throw new ArgumentException("The user have no email set for them");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("DiplomaMakers", _email));
            message.To.Add(new MailboxAddress("Salt Graduate", diplomaByGuid.EmailAddress));
            message.Subject = "Salt Diploma";

            var multipart = new Multipart("mixed");

            var body = new TextPart("html")
            {
                Text = 
                $"<h1>Congratulations, {diplomaByGuid.StudentName}! 🎉</h1><p>We are thrilled to award you the Salt Diploma. Your hard work and dedication have paid off, and we are excited to see what you accomplish next.</p> <p>Keep striving for greatness, and remember that this is just the beginning of your journey. Well done on completing the bootcamp!</p>"
            };
            multipart.Add(body);

            try
            {
                var attachment = new MimePart(file.ContentType)
                {
                    Content = new MimeContent(file.OpenReadStream(), ContentEncoding.Default),
                    ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
                    ContentTransferEncoding = ContentEncoding.Base64,
                    FileName = file.FileName
                };
                multipart.Add(attachment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the file for GUID: {GuidId}", guidid);
                throw;
            }

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
                    _logger.LogError(ex, "An error occurred while sending email for GUID: {GuidId}", guidid);
                }
            }
        }
    }
}

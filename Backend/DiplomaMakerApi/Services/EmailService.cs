using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using MimeKit;
using Microsoft.EntityFrameworkCore;
using DiplomaMakerApi.Data;

namespace DiplomaMakerApi.Services;

public class EmailService(DiplomaMakingContext _context)
{
    public async Task SendEmailWithAttachmentAsync(Guid guidid, IFormFile file, string oauthToken, string title, string description)
    {
        var diplomaByGuid = await _context.Students.FirstOrDefaultAsync(d => d.GuidId == guidid);

        if (diplomaByGuid == null)
        {
            throw new ArgumentException("Invalid guid");
        }

        if (string.IsNullOrEmpty(diplomaByGuid.Email))
        {
            throw new ArgumentException("The Student about to receive the diploma has no email set for them");
        }

        var message = new MimeMessage();
        // google will override sender field and set to the user email so can leave it with whatever
        message.From.Add(new MailboxAddress("DiplomaMakers", "email"));
        message.To.Add(new MailboxAddress("Salt Graduate", diplomaByGuid.Email));
        message.Subject = "Salt Diploma";

        var multipart = new Multipart("mixed");
        var body = new TextPart("html")
        {
            Text = $"{title.Replace("{studentName}", diplomaByGuid.Name)}{description}",
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
            throw new ArgumentException("File content is of the wrong format", ex);
        }

        message.Body = multipart;
        var credential = GoogleCredential.FromAccessToken(oauthToken);
        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "DiplomaProAPI",
        });

        using (var stream = new MemoryStream())
        {
            await message.WriteToAsync(stream);
            var gmailMessage = new Message
            {
                Raw = Convert.ToBase64String(stream.ToArray())
                    .Replace('+', '-')
                    .Replace('/', '_')
                    .Replace("=", "")
            };

            var request = service.Users.Messages.Send(gmailMessage, "me");
            await request.ExecuteAsync();
        }
    }
}

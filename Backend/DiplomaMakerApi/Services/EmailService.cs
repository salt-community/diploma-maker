using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using MimeKit;

namespace DiplomaMakerApi.Services;

public class EmailService
{
    public async Task SendEmail()
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Joey", "oshulten@gmail.com"));
        message.To.Add(new MailboxAddress("Alice", "oshulten@gmail.com"));
        message.Subject = "How you doin?";

        message.Body = new TextPart("plain")
        {
            Text = @"Hey Alice,

What are you up to this weekend? Monica is throwing one of her parties on
Saturday and I was hoping you could make it.

Will you be my +1?

-- Joey
"
        };

        // var service = new GmailService(new BaseClientService.Initializer
        // {
        //     HttpClientInitializer = credential,
        //     ApplicationName = "DiplomaProAPI",
        // });

        // using (var stream = new MemoryStream())
        // {
        //     await message.WriteToAsync(stream);
        //     var gmailMessage = new Message
        //     {
        //         Raw = Convert.ToBase64String(stream.ToArray())
        //             .Replace('+', '-')
        //             .Replace('/', '_')
        //             .Replace("=", "")
        //     };

        //     var request = service.Users.Messages.Send(gmailMessage, "me");
        //     await request.ExecuteAsync();
        // }
    }
    public async Task SendEmailWithAttachmentAsync(IFormFile file, string oauthToken, string title, string description)
    {
        // var message = new MimeMessage();
        // // google will override sender field and set to the user email so can leave it with whatever
        // message.From.Add(new MailboxAddress("DiplomaMakers", "email"));
        // message.To.Add(new MailboxAddress("Salt Graduate", "oshulten@gmail.com"));
        // message.Subject = "Salt Diploma";

        // var multipart = new Multipart("mixed");
        // var body = new TextPart("html")
        // {
        //     Text = $"{title.Replace("{studentName}", "C#")}{description}",
        // };
        // multipart.Add(body);

        // try
        // {
        //     var attachment = new MimePart(file.ContentType)
        //     {
        //         Content = new MimeContent(file.OpenReadStream(), ContentEncoding.Default),
        //         ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
        //         ContentTransferEncoding = ContentEncoding.Base64,
        //         FileName = $"Diploma-{"C#"}.pdf"
        //     };
        //     multipart.Add(attachment);
        // }
        // catch (Exception ex)
        // {
        //     throw new ArgumentException("File content is of the wrong format", ex);
        // }

        // message.Body = multipart;
        // var credential = GoogleCredential.FromAccessToken(oauthToken);
        // var service = new GmailService(new BaseClientService.Initializer
        // {
        //     HttpClientInitializer = credential,
        //     ApplicationName = "DiplomaProAPI",
        // });

        // using (var stream = new MemoryStream())
        // {
        //     await message.WriteToAsync(stream);
        //     var gmailMessage = new Message
        //     {
        //         Raw = Convert.ToBase64String(stream.ToArray())
        //             .Replace('+', '-')
        //             .Replace('/', '_')
        //             .Replace("=", "")
        //     };

        //     var request = service.Users.Messages.Send(gmailMessage, "me");
        //     await request.ExecuteAsync();
        // }
    }
}

/*
namespace DiplomaMakerApi.Services;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using MimeKit;
using Microsoft.EntityFrameworkCore;

public class EmailService
{
    private readonly DiplomaMakingContext _context;

    public EmailService(IConfiguration configuration, IWebHostEnvironment env, ILogger<EmailService> logger, DiplomaMakingContext context)
    {
        _context = context;
    }

    public async Task SendEmailWithAttachmentAsync(Guid guidid, IFormFile file, string oauthToken, string title , string description)
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
*/
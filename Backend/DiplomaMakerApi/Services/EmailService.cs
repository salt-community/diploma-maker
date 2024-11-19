using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using MimeKit;

namespace DiplomaMakerApi.Services;

public class EmailService(HttpClient _httpClient, IWebHostEnvironment _env, IConfiguration _configuration)
{
    private class ClerkOauthGoogleResponse
    {
        [JsonPropertyName("object")]
        public string? Object { get; set; }

        [JsonPropertyName("external_account_id")]
        public string? ExternalAccountId { get; set; }

        [JsonPropertyName("provider_user_id")]
        public string? JsonPropertyNameProviderUserId { get; set; }

        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("provider")]
        public string? Provider { get; set; }

        [JsonPropertyName("public_metadata")]
        public Dictionary<string, object>? PublicMetadata { get; set; }

        [JsonPropertyName("label")]
        public string? Label { get; set; }

        [JsonPropertyName("scopes")]
        public List<string>? Scopes { get; set; }
    }

    public async Task<string> GetGoogleOAuthTokenAsync(string userId, string key)
    {
        var url = $"https://api.clerk.com/v1/users/{userId}/oauth_access_tokens/oauth_google";

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", key);

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Failed to retrieve Google OAuth token from Clerk.");
        }

        var responseData = await response.Content.ReadAsStringAsync();
        var serializedData = JsonSerializer.Deserialize<List<ClerkOauthGoogleResponse>>(responseData);

        return serializedData![0].Token ?? throw new Exception("Token not found in response.");
    }

    public async Task SendEmail()
    {
        var secretKey = _env.IsDevelopment() ? _configuration["Clerk:SecretKey"]! : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;
        var googleToken = await GetGoogleOAuthTokenAsync("user_2oFiLzrmt38Z76ysoVWpT2BEoCu", secretKey);

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


        var credentials = GoogleCredential.FromAccessToken(googleToken);
        Console.WriteLine(credentials);
        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credentials,
            ApplicationName = "DiplomaProAPI",
        });

        using var stream = new MemoryStream();
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

        /*
        try
            {
                if (string.IsNullOrEmpty(googleToken))
                {
                    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (userId == null)
                    {
                        throw new Exception("The user does not exist");
                    }

                    var secretKey = _env.IsDevelopment() ? _configuration["Clerk:SecretKey"]! : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;
                    googleToken = await _clerkService.GetGoogleOAuthTokenAsync(userId, secretKey);
                }
                await _emailService.SendEmailWithAttachmentAsync(guidID, req.File, googleToken, req.Title, req.Description);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            */

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
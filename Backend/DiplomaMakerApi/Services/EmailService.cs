using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using DiplomaMakerApi.Dto;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using MimeKit;

namespace DiplomaMakerApi.Services;

public class EmailService(HttpClient _httpClient, IWebHostEnvironment _env, IConfiguration _configuration)
{
    /*
        Requests a Google OAuth token from Clerk, using the id of a specific Clerk user (associated with this project).
        The email will be sent from that user's registered address.
        TODO: Create an official </Salt> user with address from which the emails are sent
    */
    private async Task<string> GetGoogleOAuthTokenAsync()
    {
        //TODO: Get these values through ConfigurationVariables (class in program.cs)
        var clerkSecretKey = _env.IsDevelopment() ? _configuration["Clerk:SecretKey"]! : Environment.GetEnvironmentVariable("Clerk:SecretKey")!;

        var url = _configuration["Clerk:OAuthGoogleUrl"]
            ?? throw new Exception("Clerk:OAuthGoogleUrl is not defined");

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", clerkSecretKey);

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Failed to retrieve Google OAuth token from Clerk.");
        }

        var responseData = await response.Content.ReadAsStringAsync();
        var serializedData = JsonSerializer.Deserialize<List<ClerkOAuthGoogleResponse>>(responseData);

        return serializedData![0].Token ?? throw new Exception("Token not found in response.");
    }

    /*
        Sends out a congratulatory email to a graduatee, including the generated diplomas
        as an attached pdf 
    */
    public async Task SendEmail(SendEmailRequest emailRequest)
    {
        var googleToken = await GetGoogleOAuthTokenAsync();

        var message = new MimeMessage();

        message.To.Add(new MailboxAddress("Salt Graduate", emailRequest.StudentEmail));

        message.Subject = "</Salt> Diploma";

        var multipart = new Multipart("mixed");

        var body = new TextPart("html")
        {
            Text = emailRequest.MessageHtml
        };

        MemoryStream pdfStream = new(Convert.FromBase64String(emailRequest.DiplomaPdfBase64));

        var attachment = new MimePart("application/pdf")
        {
            Content = new MimeContent(pdfStream, ContentEncoding.Default),
            ContentDisposition = new ContentDisposition(ContentDisposition.Attachment),
            ContentTransferEncoding = ContentEncoding.Base64,
            FileName = $"Salt Diploma.pdf"
        };

        multipart.Add(attachment);
        multipart.Add(body);

        message.Body = multipart;

        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = GoogleCredential.FromAccessToken(googleToken),
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

        await service.Users.Messages.Send(gmailMessage, "me").ExecuteAsync();
    }

    /*
        Used only to deserialize the response from Clerk when requesting
        Google OAuth token for a specific Clerk user.
    */
    private class ClerkOAuthGoogleResponse
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
}
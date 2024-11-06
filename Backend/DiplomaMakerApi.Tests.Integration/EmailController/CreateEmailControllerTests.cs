using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.EmailController
{
    public class CreateEmailControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;
        // private readonly GoogleAuthService _googleAuthService;
        public CreateEmailControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;
            // _googleAuthService = new GoogleAuthService();
        }

        // Work in progress to make this pass... It gets stuck on THE LAST PART OF EMAILSERVICE
        // "Request had insufficient authentication scopes."
        // The account through gcloud is missing the emailsend scopes. So we somehow need to add it or authenticate through the gmail api

        // how far i got.
        // step 1 - Install gcloud
        // step 2 - Login through terminal -> gcloud auth login
        // step 3 - Check if logged in -> gcloud auth list
        // step 4 - List what scopes your account has -> gcloud auth application-default print-access-token | xargs -I {} curl -H "Authorization: Bearer {}" https://www.googleapis.com/oauth2/v1/tokeninfo
        // if https://www.googleapis.com/auth/gmail.send is not listed under scopes
        // step 5 - 

        // [Fact]
        // public async Task CreateEmailControllerTests_SendsRealEmail_WhenDataIsValid()
        // {
        //     // Arrange
        //     var studentSetup = await _client.GetAsync("api/Students");
        //     var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
        //     var loggedInUserEmail = await _googleAuthService.GetGoogleEmailAsync();

        //     var newStudentRequest = new StudentUpdateRequestDto()
        //     {
        //         Name = "Bob Ryder",
        //         Email = loggedInUserEmail
        //     };

        //     await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].GuidId}", newStudentRequest);

        //     var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
        //     var pdfFormFile = TestUtil.ConvertToIFormFile(pdfFile, "Default.pdf", "application/pdf");

        //     var googleToken = await _googleAuthService.GetGoogleOAuthTokenAsync();
        //     var emailRequestContent = new MultipartFormDataContent
        //     {
        //         { new StreamContent(pdfFormFile.OpenReadStream())
        //             {
        //                 Headers = { ContentType = new MediaTypeHeaderValue("application/pdf") }
        //             }, 
        //             "File", pdfFormFile.FileName 
        //         }
        //     };

        //     var response = await _client.PostAsync(
        //         $"api/Email/email-student/{studentSetupResponse![0].GuidId}?Title=testTitle&Description=testDescription&googleToken={googleToken}", 
        //         emailRequestContent
        //     );

        //     if (response.StatusCode != HttpStatusCode.OK)
        //     {
        //         var errorContent = await response.Content.ReadAsStringAsync();
        //         Console.WriteLine("Error Message: " + errorContent);
        //     }

        //     // Assert
        //     response.StatusCode.Should().Be(HttpStatusCode.OK);
        // }

        [Fact]
        public async Task CreateEmailControllerTests_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PostAsJsonAsync($"api/Email/email-student/{Guid.NewGuid()}", new object { });

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
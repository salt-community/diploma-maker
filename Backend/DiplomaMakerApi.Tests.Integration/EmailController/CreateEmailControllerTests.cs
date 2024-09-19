using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.EmailController
{
    public class CreateEmailControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;
        public CreateEmailControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;
        }

        [Fact]
        public async Task CreateEmailControllerTests_SendsEmail_WhenDataIsvalid()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfFormFile = TestUtil.ConvertToIFormFile(pdfFile, "Default.pdf", "application/pdf");
            var emailRequest = new SendEmailRequest()
            {
                File = pdfFormFile,
                Title = "testTitle",
                Description = "testDescription"
            };

            // Act
            var response = await _client.PostAsJsonAsync($"api/Email/email-student/{studentSetupResponse![0].GuidId}", emailRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task CreateEmailControllerTests_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PostAsJsonAsync($"api/Email/email-student/{Guid.NewGuid()}", new object{});

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
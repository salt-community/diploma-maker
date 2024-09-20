using System.Net;
using System.Net.Http.Headers;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetPdfBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly ILogger<GetPdfBlobControllerTests> _logger;
        private readonly string _testBlobFolder;
        public GetPdfBlobControllerTests(DiplomaMakerApiFactory apiFactory, ITestOutputHelper outputHelper)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;

            var loggerFactory = LoggerFactory.Create(builder => {
                builder.AddXUnit(outputHelper);
            });
            _logger = loggerFactory.CreateLogger<GetPdfBlobControllerTests>(); // Run dotnet test --logger "console;verbosity=detailed" to see logs
        }

        [Fact]
        public async Task GetFile_ReturnsFile_WhenFileExists()
        {
            var testFileExists = TestUtil.CheckFileExists("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            if(testFileExists)
            {
                _logger.LogInformation($"Default.pdf exists! in {_testBlobFolder}/DiplomaPdfs");
            }
            // Act
            var response = await _client.GetAsync("api/Blob/Default.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            if (response.StatusCode != HttpStatusCode.Created)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Failed to create template. Status Code: {(int)response.StatusCode}, Error: {errorMessage}");
            }
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/pdf");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetFile_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/{Guid.NewGuid()}.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetDiplomaPdf_ReturnsFile_WhenFileExists()
        {
            // Act
            var response = await _client.GetAsync("api/Blob/DiplomaPdfs/Default.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/pdf");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetDiplomaPdf_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/{Guid.NewGuid()}.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
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
        public GetPdfBlobControllerTests(DiplomaMakerApiFactory apiFactory, ITestOutputHelper outputHelper)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");

            var loggerFactory = LoggerFactory.Create(builder => {
                builder.AddXUnit(outputHelper);
            });
            _logger = loggerFactory.CreateLogger<GetPdfBlobControllerTests>(); // Run dotnet test --logger "console;verbosity=detailed" to see logs
        }

        [Fact]
        public async Task GetFile_ReturnsFile_WhenFileExists()
        {
            // Act
            var response = await _client.GetAsync("api/Blob/Default.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/pdf");
        }

        [Fact]
        public async Task GetFile_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/{Guid.NewGuid()}.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetDiplomaPdf_ReturnsFile_WhenFileExists()
        {
            // Act
            var response = await _client.GetAsync("api/Blob/DiplomaPdfs/Default.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/pdf");
        }

        [Fact]
        public async Task GetDiplomaPdf_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/{Guid.NewGuid()}.pdf");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
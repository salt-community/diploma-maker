using System.Net;
using System.Net.Http.Headers;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetPdfBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public GetPdfBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
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

    }
}
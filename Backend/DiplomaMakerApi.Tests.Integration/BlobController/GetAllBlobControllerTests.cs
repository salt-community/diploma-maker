using System.Net;
using System.Net.Http.Headers;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetAllBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        public GetAllBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task DownloadAllFiles_ReturnsZipOfAllTemplateBackgrounds_WhenAuthorized()
        {
            // Arrange
            var setupTemplate = _templateRequestGenerator.Generate();
            var setupTemplateResponse = await TestUtil.CreateAndPostAsync<TemplatePostRequestDto, TemplateResponseDto>(
                _client, setupTemplate, "api/Templates"
            );

            // Act
            var response = await _client.GetAsync("api/Blob/download-all-templatebackgrounds");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/zip");
            var content = await response.Content.ReadAsByteArrayAsync();
            using (var stream = new MemoryStream(content))
            {
                using (var zip = new System.IO.Compression.ZipArchive(stream))
                {
                    var defaultpdfExists = zip.GetEntry("Default.pdf");
                    defaultpdfExists.Should().NotBeNull();

                    var addedPdfExists = zip.GetEntry($"{setupTemplateResponse.Name}.pdf");
                    addedPdfExists.Should().NotBeNull();
                }
            }
        }

        [Fact]
        public async Task DownloadAllFiles_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync("api/Blob/download-all-templatebackgrounds");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
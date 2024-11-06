using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Xunit;
using Xunit.Abstractions;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class GetPreviewImageBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;

        private readonly ILogger<GetPdfBlobControllerTests> _logger;
        public GetPreviewImageBlobControllerTests(DiplomaMakerApiFactory apiFactory, ITestOutputHelper outputHelper)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;

            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddXUnit(outputHelper);
            });
            _logger = loggerFactory.CreateLogger<GetPdfBlobControllerTests>();
        }

        [Fact]
        public async Task GetLQPreviewImage_ReturnsLowQualityImage_WhenFileExists()
        {
            // Arrange
            var bootcampSetup = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetup.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var studentSetup = bootcampSetupResponse![0].Students.First();
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            var previewImageRequest = new MultipartFormDataContent
            {
                { new StringContent(studentSetup.Guid.ToString()), "StudentGuidId" },
                { new StringContent(pdfBase64String), "Image" }
            };

            var previewImageSetup = await _client.PutAsync("api/Blob/UpdateStudentsPreviewImage", previewImageRequest);
            if (previewImageSetup.StatusCode != HttpStatusCode.OK)
            {
                var errorContent = await previewImageSetup.Content.ReadAsStringAsync();
                _logger.LogError("Failed to get preview image. Status Code: {StatusCode}, Error: {ErrorContent}", previewImageSetup.StatusCode, errorContent);
            }
            previewImageSetup.StatusCode.Should().Be(HttpStatusCode.OK);

            // Act
            var response = await _client.GetAsync($"api/Blob/ImagePreviewLQIP/{studentSetup!.Guid}.webp");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/webp");
            (await response.Content.ReadAsByteArrayAsync()).Length.Should().BeLessThan(5 * 1024); // Takes up less than 5kb
        }

        [Fact]
        public async Task GetLQPreviewImage_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/ImagePreviewLQIP/{Guid.NewGuid()}.webp");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetPreviewImage_ReturnsHighQualityImage_WhenFileExists()
        {
            // Arrange
            var bootcampSetup = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetup.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var studentSetup = bootcampSetupResponse![0].Students.First();
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            var previewImageRequest = new MultipartFormDataContent
            {
                { new StringContent(studentSetup.Guid.ToString()), "StudentGuidId" },
                { new StringContent(pdfBase64String), "Image" }
            };

            var previewImageSetup = await _client.PutAsync("api/Blob/UpdateStudentsPreviewImage", previewImageRequest);
            previewImageSetup.StatusCode.Should().Be(HttpStatusCode.OK);

            // Act
            var response = await _client.GetAsync($"api/Blob/ImagePreview/{studentSetup!.Guid}.webp");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            response.Content.Headers.ContentType!.MediaType.Should().Be("application/webp");
            (await response.Content.ReadAsByteArrayAsync()).Length.Should().BeGreaterThan(5 * 1024); // Takes up more than 5kb
        }

        [Fact]
        public async Task GetPreviewImage_ReturnsNotFound_WhenFileDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Blob/GetPreviewImage/{Guid.NewGuid()}.webp");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
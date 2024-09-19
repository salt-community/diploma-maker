using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BlobController
{
    public class UpdatePreviewImageBlobControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly string _testBlobFolder;
        public UpdatePreviewImageBlobControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
            _testBlobFolder = apiFactory.TestBlobFolder;
        }

        [Fact]
        public async Task UpdateStudentsPreviewImages_UpdatesStudentPreviewImage_WhenDataIsValid()
        {
            // Arrange
            var bootcampSetup = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetup.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var studentSetup = bootcampSetupResponse![0].Students.First();
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            var previewImageRequest = new MultipartFormDataContent
            {
                { new StringContent(studentSetup.GuidId.ToString()), "StudentGuidId" },
                { new StringContent(pdfBase64String), "Image" }
            };

            // Act
            var response = await _client.PutAsync("api/Blob/UpdateStudentsPreviewImage", previewImageRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentResponse = await response.Content.ReadFromJsonAsync<StudentResponseDto>();
            studentResponse!.GuidId.Should().Be(studentSetup.GuidId);
            TestUtil.CheckFileExists(studentSetup.GuidId.ToString(), ".webp", _testBlobFolder, "ImagePreview");
        }
    }
}
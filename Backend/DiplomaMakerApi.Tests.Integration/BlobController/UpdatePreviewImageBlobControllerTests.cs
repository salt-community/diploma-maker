using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.MIddleware;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
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

        [Fact]
        public async Task UpdateStudentsPreviewImages_ReturnsNotFound_WhenStudentDoesNotExist()
        {
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            var previewImageRequest = new MultipartFormDataContent
            {
                { new StringContent(Guid.NewGuid().ToString()), "StudentGuidId" },
                { new StringContent(pdfBase64String), "Image" }
            };
            // Act
            var response = await _client.PutAsync("api/Blob/UpdateStudentsPreviewImage", previewImageRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateStudentsPreviewImages_ReturnsBadRequest_WhenDataIsInvalid()
        {
            // Arrange
            var bootcampSetup = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetup.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var studentSetup = bootcampSetupResponse![0].Students.First();
            var previewImageRequest = new MultipartFormDataContent
            {
                { new StringContent(studentSetup.GuidId.ToString()), "StudentGuidId" },
                { new StringContent("badData"), "Image" }
            };

            // Act
            var response = await _client.PutAsync("api/Blob/UpdateStudentsPreviewImage", previewImageRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var errorResponse = await response.Content.ReadFromJsonAsync<CustomErrorResponse>();
            errorResponse!.Message.Should().Be("The provided image is not a valid Base64 PDF string.");
        }

        [Fact]
        public async Task UpdateBundledStudentsPreviewImages_UpdatesStudentPreviewImages_WhenDataIsValid()
        {
            // Arrange
            var bootcampSetup = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetup.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var students = bootcampSetupResponse![0].Students;
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            var previewImageRequest = new MultipartFormDataContent();
            for (int i = 0; i < students.Count; i++)
            {
                var student = students[i];
                previewImageRequest.Add(new StringContent(student.GuidId.ToString()), $"PreviewImageRequests[{i}].StudentGuidId");
                previewImageRequest.Add(new StringContent(pdfBase64String), $"PreviewImageRequests[{i}].Image");
            }

            // Act
            var response = await _client.PutAsync("api/Blob/UpdateBundledStudentsPreviewImages", previewImageRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentsResponse = await response.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            studentsResponse!.Count.Should().Be(students.Count);
            foreach (var student in students)
            {
                var studentResponse = studentsResponse.FirstOrDefault(s => s.GuidId == student.GuidId);
                studentResponse.Should().NotBeNull();
                TestUtil.CheckFileExists(student.GuidId.ToString(), ".webp", _testBlobFolder, "ImagePreview");
            }
        }

        [Fact]
        public async Task UpdateBundledStudentsPreviewImages_ReturnsBadRequest_WhenStudentDoesNotExist()
        {
            // Arrange
            var previewImageRequest = new MultipartFormDataContent();
            var pdfFile = TestUtil.GetFileContent("Default", ".pdf", _testBlobFolder, "DiplomaPdfs");
            var pdfBase64String = Convert.ToBase64String(pdfFile);
            for (int i = 0; i < 3; i++)
            {
                previewImageRequest.Add(new StringContent(Guid.NewGuid().ToString()), $"PreviewImageRequests[{i}].StudentGuidId");
                previewImageRequest.Add(new StringContent(pdfBase64String), $"PreviewImageRequests[{i}].Image");
            }

            // Act
            var response = await _client.PutAsync("api/Blob/UpdateBundledStudentsPreviewImages", previewImageRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
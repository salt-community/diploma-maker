using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.StudentController
{
    public class GetStudentControllerTests : IClassFixture<DiplomaMakerApiFactory>
    { 
        private readonly HttpClient _client;
        public GetStudentControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task GetStudentByGuidId_ReturnsStudent_WhenStudentExists()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();

            // Act
            var response = await _client.GetAsync($"api/Students/{studentSetupResponse![0].GuidId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentResponse = await response.Content.ReadFromJsonAsync<StudentResponseDto>();
            studentResponse!.Name.Should().Be(studentSetupResponse[0].Name);
        }

        [Fact]
        public async Task GetStudentByGuidId_ReturnsNotFound_WhenStudentDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Students/{Guid.NewGuid()}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task getStudentByVerificationCode_ReturnsStudent_WhenStudentExists()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();

            // Act
            var response = await _client.GetAsync($"api/Students/verificationCode/{studentSetupResponse![0].VerificationCode}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentResponse = await response.Content.ReadFromJsonAsync<StudentResponseDto>();
            studentResponse.Should().BeEquivalentTo(studentSetupResponse[0]);
        }
    }
}
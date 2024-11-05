using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.StudentController
{
    public class DeleteStudentsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public DeleteStudentsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task DeleteStudent_ReturnsNoContent_WhenValidRequest()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();

            // Act
            var response = await _client.DeleteAsync($"api/Students/{studentSetupResponse![0].GuidId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
            var assertResponse = await _client.GetAsync("api/Students");
            var studentsAssertResponse = await assertResponse.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            studentsAssertResponse!.Count.Should().Be(studentSetupResponse.Count - 1);
        }

        [Fact]
        public async Task DeleteStudent__ReturnsNoContent_WhenValidRequest()
        {
            // Act
            var response = await _client.DeleteAsync($"api/Students/{Guid.NewGuid()}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task DeleteStudent_ReturnsUnathorized_WhenInvalidToken()
        {
            // Setup
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.DeleteAsync($"api/Students/{Guid.NewGuid()}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
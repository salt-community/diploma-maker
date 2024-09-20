using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.StudentController
{
    public class GetAllTemplatesControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public GetAllTemplatesControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetStudents_ReturnsAllStudents_WhenAuthorized()
        {
            // Act
            var response = await _client.GetAsync("api/Students");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var students = await response.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            students.Should().HaveCountGreaterThan(2);
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetTemplates_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync("api/Templates");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
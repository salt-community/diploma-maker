using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.StudentController
{
    public class UpdateStudentControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        public UpdateStudentControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task UpdateStudents_UpdatesStudent_WhenDataIsValid()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            var newStudentRequest = new StudentUpdateRequestDto()
            {
                Name = "Bob Ryder",
                Email = "bob.ryder@gmail.com"   
            };
            // Act
            var response = await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].GuidId}", newStudentRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentResponse = await response.Content.ReadFromJsonAsync<StudentResponseDto>();
            studentResponse!.Name.Should().Be(newStudentRequest.Name);
            studentResponse!.Email.Should().Be(newStudentRequest.Email);
        }

        [Fact]
        public async Task UpdateStudents_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            var newStudentRequest = new StudentUpdateRequestDto()
            {
                Name = "Bob Ryder",
                Email = "bob.ryder@gmail.com"   
            };
            _client.DefaultRequestHeaders.Authorization = null;
            
            // Act
            var response = await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].GuidId}", newStudentRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

    }
}
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
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
            var response = await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].Guid}", newStudentRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var studentResponse = await response.Content.ReadFromJsonAsync<StudentResponseDto>();
            studentResponse!.Name.Should().Be(newStudentRequest.Name);
            studentResponse!.Email.Should().Be(newStudentRequest.Email);
        }

        [Fact]
        public async Task UpdateStudents_ReturnsNotFound_WhenStudentDoesNotExist()
        {
            // Setup
            var newStudentRequest = new StudentUpdateRequestDto()
            {
                Name = "Bob Ryder",
                Email = "bob.ryder@gmail.com"
            };
            // Act
            var response = await _client.PutAsJsonAsync($"api/Students/{Guid.NewGuid()}", newStudentRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateStudents_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
            var studentSetup = await _client.GetAsync("api/Students");
            var studentSetupResponse = await studentSetup.Content.ReadFromJsonAsync<List<StudentResponseDto>>();
            var badRequests = new List<(object data, string[] expectedErrorMessages)>()
            {
                (new {}, new[]{
                    "The updateDto field is required."
                }),
                (new {Name = "", Email = "bob@gmail.com"}, new[]{
                    "Name cannot be empty"
                }),
                (new {Name = "Bob", Email = ""}, new[]{
                    "Email cannot be empty"
                }),
                (new {Name = "bob", Email = "invalidEmail"}, new[]{
                    "Invalid email format"
                }),
            };
            foreach (var (data, expectedErrorMessages) in badRequests)
            {
                // Act
                var response = await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].Guid}", data);

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
                var error = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
                error!.Status.Should().Be(400);
                error.Title.Should().Be("One or more validation errors occurred.");

                var allErrorMessages = error.Errors.SelectMany(kvp => kvp.Value).ToArray();
                allErrorMessages.Should().Contain(message => expectedErrorMessages.Any(expected => message.Contains(expected)));
            }
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
            var response = await _client.PutAsJsonAsync($"api/Students/{studentSetupResponse![0].Guid}", newStudentRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

    }
}
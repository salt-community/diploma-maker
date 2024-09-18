using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using Bogus;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class UpdateBootcampStudentsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<StudentRequestDto> _studentRequestsGenerator;
        private readonly Faker<BootcampRequestUpdateDto> _bootcampStudentRequestGenerator;
        public UpdateBootcampStudentsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");

            _studentRequestsGenerator = new Faker<StudentRequestDto>()
                .RuleFor(s => s.GuidId, faker => Guid.NewGuid())
                .RuleFor(s => s.VerificationCode, faker => faker.Random.AlphaNumeric(6))
                .RuleFor(s => s.Name, faker => faker.Name.FullName())
                .RuleFor(s => s.Email, faker => faker.Internet.Email());

            _bootcampStudentRequestGenerator = new Faker<BootcampRequestUpdateDto>()
                .RuleFor(b => b.templateId, faker => 1)
                .RuleFor(b => b.students, faker => _studentRequestsGenerator.GenerateBetween(10, 15));
        }

        [Fact]
        public async Task UpdatePreviewData_UpdatesBootcampStudents_WhenDataIsValid()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var updatedStudentsRequest = _bootcampStudentRequestGenerator.Generate();

            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupResponse![0].GuidId}", updatedStudentsRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var updatedStudentsResponse = await response.Content.ReadFromJsonAsync<BootcampResponseDto>();
            updatedStudentsRequest.students
                .All(updatedStudent => updatedStudentsResponse!.Students
                    .Any(student =>
                        student.GuidId == updatedStudent.GuidId &&
                        student.Name == updatedStudent.Name &&
                        student.VerificationCode == updatedStudent.VerificationCode &&
                        student.Email == updatedStudent.Email))
                .Should().BeTrue();
        }

        [Fact]
        public async Task UpdatePreviewData_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var badRequests = new List<(object data, string[] expectedErrorMessages)>()
            {
                (new { TrackId = 0, GraduationDate = DateTime.UtcNow }, new[] { 
                    "TrackId must be between 1 and 3.", 
                }),
                (new { TrackId = 4, GraduationDate = DateTime.UtcNow }, new[] { 
                    "TrackId must be between 1 and 3.", 
                }),
                 (new { TrackId = 1, GraduationDate = "invalidDate" }, new[] { 
                    "The requestDto field is required."
                }),
            };
            foreach (var (data, expectedErrorMessages) in badRequests)
            {
                // Act
                var response = await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupResponse![0].GuidId}", data);
            
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
        public async Task UpdatePreviewData_ReturnsNotFound_WhenBootcampDoesNotExist()
        {
            // Setup
            var updatedStudentsRequest = _bootcampStudentRequestGenerator.Generate();

            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{Guid.NewGuid()}", updatedStudentsRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task PutBootcamp_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var updatedStudentsRequest = _bootcampStudentRequestGenerator.Generate();
            _client.DefaultRequestHeaders.Authorization = null;
            
            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{Guid.NewGuid()}", updatedStudentsRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
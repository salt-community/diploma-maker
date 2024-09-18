using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using Bogus;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
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
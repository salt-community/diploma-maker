using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.HistorySnapshotsController
{
    public class GetHistorySnapshotsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<StudentRequestDto> _studentRequestsGenerator;
        private readonly Faker<BootcampRequestUpdateDto> _bootcampStudentRequestGenerator;
        public GetHistorySnapshotsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test-token");

            _studentRequestsGenerator = new Faker<StudentRequestDto>()
                .RuleFor(s => s.GuidId, faker => Guid.NewGuid())
                .RuleFor(s => s.VerificationCode, faker => faker.Random.AlphaNumeric(6))
                .RuleFor(s => s.Name, faker => faker.Name.FullName())
                .RuleFor(s => s.Email, faker => faker.Internet.Email());

            _bootcampStudentRequestGenerator = new Faker<BootcampRequestUpdateDto>()
                .RuleFor(b => b.templateId, faker => 1)
                .RuleFor(b => b.students, faker => _studentRequestsGenerator.GenerateBetween(10, 20));
        }

        [Fact]
        public async Task GetHistoryByVerificationCode_ReturnsHistorySnapshot_WhenHistorySnapshotExists()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var updatedStudentsRequest = _bootcampStudentRequestGenerator.Generate(); 
            
            await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupResponse![0].GuidId}", updatedStudentsRequest);

            foreach (var student in updatedStudentsRequest.students)
            {
                // Act
                var response = await _client.GetAsync($"api/HistorySnapshots/{student.VerificationCode}");

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
                var historySnapshotsResponse = await response.Content.ReadFromJsonAsync<List<DiplomaSnapshotResponseDto>>();
                historySnapshotsResponse![0].VerificationCode.Should().Be(student.VerificationCode);
            }
        }
    }
}
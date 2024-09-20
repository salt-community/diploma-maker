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
    public class GetAllHistorySnapshotsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<StudentRequestDto> _studentRequestsGenerator;
        private readonly Faker<BootcampRequestUpdateDto> _bootcampStudentRequestGenerator;
        public GetAllHistorySnapshotsControllerTests(DiplomaMakerApiFactory apiFactory)
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
                .RuleFor(b => b.students, faker => _studentRequestsGenerator.GenerateBetween(25, 30));
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetHistory_ReturnsAllHistory_WhenHistoryExists()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var updatedStudentsRequest = _bootcampStudentRequestGenerator.Generate(); 
            await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupResponse![0].GuidId}", updatedStudentsRequest);

            // Act
            var response = await _client.GetAsync("api/HistorySnapshots");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var historySnapshotsResponse = await response.Content.ReadFromJsonAsync<List<DiplomaSnapshotResponseDto>>();
            historySnapshotsResponse!.Count.Should().Be(updatedStudentsRequest.students.Count);
            historySnapshotsResponse[0].BasePdf.Should().Be($"Blob/DiplomaPdfs/Default.v1.pdf");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetHistory_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync("api/HistorySnapshots");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
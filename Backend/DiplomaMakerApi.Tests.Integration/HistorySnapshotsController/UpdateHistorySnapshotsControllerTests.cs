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
    public class UpdateHistorySnapshotsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<TemplatePostRequestDto> _templateRequestGenerator =
            new Faker<TemplatePostRequestDto>()
                .RuleFor(x => x.templateName, faker => Path.GetFileNameWithoutExtension(faker.System.FileName()));
        private readonly Faker<StudentRequestDto> _studentRequestsGenerator;
        private readonly Faker<BootcampRequestUpdateDto> _bootcampStudentRequestGenerator;
        public UpdateHistorySnapshotsControllerTests(DiplomaMakerApiFactory apiFactory)
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

        // Each HistorySnapshot represents a student generated at some point in time
        [Fact(Skip = "Skipping this test for now.")]
        public async Task MakeActiveHistorySnapshot_MakesActiveHistorysnapshot_WhenDataIsInvalid()
        {
            // Initial Setup
            // add students to first bootcamp -> add new template -> switch to that template
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupHttpResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();

            var studentsSetupRequest = _bootcampStudentRequestGenerator.Generate(); 
            await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupHttpResponse![0].GuidId}", studentsSetupRequest);

            var templateSetupRequest = _templateRequestGenerator.Generate();
            var templateSetupHttpResponse = await _client.PostAsJsonAsync("api/Templates", templateSetupRequest);
            var templateSetupResponse = await templateSetupHttpResponse.Content.ReadFromJsonAsync<TemplateResponseDto>();

            studentsSetupRequest.templateId = templateSetupResponse!.Id;
            await _client.PutAsJsonAsync($"api/Bootcamps/dynamicfields/{bootcampSetupHttpResponse![0].GuidId}", studentsSetupRequest);

            // Each student has now updated twice -> checking historysnapshots reflect that
            var historySetupHttpResponse = await _client.GetAsync($"api/HistorySnapshots");
            var historySetupResponse = await historySetupHttpResponse.Content.ReadFromJsonAsync<List<DiplomaSnapshotResponseDto>>();
            historySetupResponse!.Count.Should().Be(studentsSetupRequest.students.Count * 2);

            var studentHistorySnapshots = historySetupResponse.Where(hs => hs.VerificationCode == studentsSetupRequest.students[0].VerificationCode).ToList();
            studentHistorySnapshots[0].Active.Should().BeFalse();
            studentHistorySnapshots[0].BasePdf.Should().Be($"Blob/DiplomaPdfs/Default.v1.pdf");

            studentHistorySnapshots[studentHistorySnapshots.Count - 1].Active.Should().BeTrue();
            studentHistorySnapshots[studentHistorySnapshots.Count - 1].BasePdf.Should().Be($"Blob/DiplomaPdfs/{templateSetupRequest.templateName}.v1.pdf");

            // Arrange
            var snapshotIds = historySetupResponse
                .Where(h => h.Active == false)
                .Select(h => h.Id)
                .ToArray();

            var studentGuidIds = historySetupResponse
                .Where(h => h.Active == false && h.StudentGuidId.HasValue)
                .Select(h => h.StudentGuidId!.Value)
                .ToArray();
            
            var makeActiveSnapshotRequest = new MakeActiveSnapshotRequestDto()
            {
                Ids = snapshotIds,
                StudentGuidIds = studentGuidIds,
            };

            // Act
            var response = await _client.PutAsJsonAsync("api/make-active-historysnapshot", makeActiveSnapshotRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var historySnapshotHttpResponse = await _client.GetAsync($"api/HistorySnapshots");
            var historySnapshotResponse = await historySnapshotHttpResponse.Content.ReadFromJsonAsync<List<DiplomaSnapshotResponseDto>>();
            var studenthistorySnapshots = historySnapshotResponse!.Where(hs => hs.VerificationCode == studentsSetupRequest.students[0].VerificationCode).ToList();
            studenthistorySnapshots[0].Active.Should().BeTrue();
            studenthistorySnapshots[0].BasePdf.Should().Be($"Blob/DiplomaPdfs/Default.v1.pdf");

            studenthistorySnapshots[studenthistorySnapshots.Count - 1].Active.Should().BeFalse();
            studenthistorySnapshots[studenthistorySnapshots.Count - 1].BasePdf.Should().Be($"Blob/DiplomaPdfs/{templateSetupRequest.templateName}.v1.pdf");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task MakeActiveHistorySnapshot_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PutAsJsonAsync("api/make-active-historysnapshot", new object {});

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class GetAllBootcampsControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<BootcampRequestDto> _bootcampRequestGenerator = 
            new Faker<BootcampRequestDto>()
                .RuleFor(b => b.GraduationDate, _ => DateTime.UtcNow)
                .RuleFor(b => b.TrackId, faker => faker.Random.Int(1, 3));
        public GetAllBootcampsControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async void GetBootcamps_ReturnsAllBootcamps_WhenAuthorized()
        {
            // Arrange
            var trackIdToNameMap = new Dictionary<int, string>
            {
                { 1, "C# Dotnet" },
                { 2, "Java" },
                { 3, "Javascript" }
            };
            var setupBootcamp = _bootcampRequestGenerator.Generate();
            var setupBootcampResponse = await TestUtil.CreateAndPostAsync<BootcampRequestDto, BootcampResponseDto>(
                _client, setupBootcamp, "api/Bootcamps"
            );
            
            // Act
            var response = await _client.GetAsync("api/Bootcamps");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var bootcampsResponse = await response.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            bootcampsResponse!.Count.Should().BeGreaterThan(1);
            bootcampsResponse.Should().Contain(b => 
                b.GraduationDate.Date == setupBootcamp.GraduationDate.Date &&
                b.Track.Name == trackIdToNameMap[setupBootcamp.TrackId]);
        }

        [Fact(Skip = "Skipping this test for now.")]
        public async Task GetBootcamps_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync("api/Bootcamps");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
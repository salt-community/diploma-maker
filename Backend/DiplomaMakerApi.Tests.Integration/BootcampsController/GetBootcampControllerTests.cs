using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class GetBootcampControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<BootcampRequestDto> _bootcampRequestGenerator = 
            new Faker<BootcampRequestDto>()
                .RuleFor(b => b.GraduationDate, _ => DateTime.UtcNow)
                .RuleFor(b => b.TrackId, faker => faker.Random.Int(1, 3));
        public GetBootcampControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async void GetBootcampByGuidId_ReturnsTemplate_WhenIdExists()
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
            var response = await _client.GetAsync($"api/Bootcamps/{setupBootcampResponse.GuidId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var bootcampResponse = await response.Content.ReadFromJsonAsync<BootcampResponseDto>();
            bootcampResponse!.GraduationDate.Date.Should().Be(setupBootcamp.GraduationDate.Date);
            bootcampResponse.Track.Name.Should().Be(trackIdToNameMap[setupBootcamp.TrackId]);
        }

        [Fact]
        public async Task GetBootcampByGuidId_ReturnsNotFound_WhenBootcampDoesNotExist()
        {
            // Act
            var response = await _client.GetAsync($"api/Bootcamps/{Guid.NewGuid()}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task GetBootcampByGuidId_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync($"api/Bootcamps/{32135}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
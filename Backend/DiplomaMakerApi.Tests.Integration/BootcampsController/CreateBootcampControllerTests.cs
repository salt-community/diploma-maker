using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class CreateBootcampControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<BootcampRequestDto> _bootcampRequestGenerator = 
            new Faker<BootcampRequestDto>()
                .RuleFor(b => b.GraduationDate, _ => DateTime.UtcNow)
                .RuleFor(b => b.TrackId, faker => faker.Random.Int(1, 3));
        public CreateBootcampControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async void PostBootcamp_ReturnsBootcamp_WhenDataIsInvalid()
        {
            // Arrange
            var trackIdToNameMap = new Dictionary<int, string>
            {
                { 1, "C# Dotnet" },
                { 2, "Java" },
                { 3, "Javascript" }
            };
            var bootcampRequest = _bootcampRequestGenerator.Generate();

            // Act
            var response = await _client.PostAsJsonAsync("api/Bootcamps", bootcampRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Created);
            var bootcampResponse = await response.Content.ReadFromJsonAsync<BootcampResponseDto>();
            bootcampResponse!.GraduationDate.Should().Be(bootcampRequest.GraduationDate);
            bootcampResponse.Track.Name.Should().Be(trackIdToNameMap[bootcampRequest.TrackId]);
        }
    }
}
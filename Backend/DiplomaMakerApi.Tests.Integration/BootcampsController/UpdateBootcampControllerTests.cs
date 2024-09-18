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
    public class UpdateBootcampControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<BootcampRequestDto> _bootcampPutRequestGenerator = 
            new Faker<BootcampRequestDto>()
                .RuleFor(b => b.GraduationDate, _ => DateTime.UtcNow)
                .RuleFor(b => b.TrackId, faker => faker.Random.Int(1, 3));
        public UpdateBootcampControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async Task PutBootcamp_UpdatesBootcamp_WhenDataIsValid()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            var putBootcampRequest = _bootcampPutRequestGenerator.Generate();

            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/{bootcampSetupResponse![0].GuidId}", putBootcampRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var bootcampResponse = await response.Content.ReadFromJsonAsync<BootcampResponseDto>();
            bootcampResponse!.GuidId.Should().Be(bootcampSetupResponse![0].GuidId);
            bootcampResponse!.GraduationDate.Date.Should().Be(putBootcampRequest.GraduationDate.Date);
            bootcampResponse!.GraduationDate.Date.Should().NotBe(bootcampSetupResponse[0].GraduationDate.Date);
        }

        [Fact]
        public async Task PutBootcamp_ReturnsNotFound_WhenBootcampDoesNotExist()
        {
            // Setup
            var putBootcampRequest = _bootcampPutRequestGenerator.Generate();

            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/{Guid.NewGuid()}", putBootcampRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task PutBootcamp_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var putBootcampRequest = _bootcampPutRequestGenerator.Generate();
            _client.DefaultRequestHeaders.Authorization = null;
            
            // Act
            var response = await _client.PutAsJsonAsync($"api/Bootcamps/{Guid.NewGuid()}", putBootcampRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
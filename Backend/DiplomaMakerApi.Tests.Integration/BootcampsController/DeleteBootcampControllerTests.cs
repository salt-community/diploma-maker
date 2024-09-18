using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.BootcampsController
{
    public class DeleteBootcampControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;
        private readonly Faker<BootcampRequestDto> _bootcampRequestGenerator = 
            new Faker<BootcampRequestDto>()
                .RuleFor(b => b.GraduationDate, _ => DateTime.UtcNow)
                .RuleFor(b => b.TrackId, faker => faker.Random.Int(1, 3));
        public DeleteBootcampControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", "test-token");
        }

        [Fact]
        public async void DeleteBootcamp_ReturnsNoContent_WhenBootcampExists()
        {
            // Arrange
            var setupBootcamp = _bootcampRequestGenerator.Generate();
            var setupBootcampResponse = await TestUtil.CreateAndPostAsync<BootcampRequestDto, BootcampResponseDto>(
                _client, setupBootcamp, "api/Bootcamps"
            );

            // Act
            var response = await _client.DeleteAsync($"api/Bootcamps/{setupBootcampResponse.GuidId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
            var assertResponse = await _client.GetAsync("api/Bootcamps");
            var bootcampsAssertResponse = await assertResponse.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
            bootcampsAssertResponse.Should().NotContain(b => b.GuidId == setupBootcampResponse.GuidId);
        }

        [Fact]
        public async Task DeleteBootcamp_ReturnsNotFound_WhenBootcampDoesNotExist()
        {
            // Act
            var response = await _client.DeleteAsync($"api/Bootcamps/{Guid.NewGuid()}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
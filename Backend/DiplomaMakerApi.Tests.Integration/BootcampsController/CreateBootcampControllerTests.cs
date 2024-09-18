using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
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

        [Fact]
        public async Task PostBootcamp_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
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
                var response = await _client.PostAsJsonAsync("api/Bootcamps", data);

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
        public async Task PostBootcamp_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            var bootcampRequest = _bootcampRequestGenerator.Generate();
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.PostAsJsonAsync("api/Templates", bootcampRequest);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Bogus;
using DiplomaMakerApi.Dtos;
using DiplomaMakerApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
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
        public async Task PutBootcamp_ReturnsValidationError_WhenDataIsInvalid()
        {
            // Arrange
            var bootcampSetupRequest = await _client.GetAsync("api/Bootcamps");
            var bootcampSetupResponse = await bootcampSetupRequest.Content.ReadFromJsonAsync<List<BootcampResponseDto>>();
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
                var response = await _client.PutAsJsonAsync($"api/Bootcamps/{bootcampSetupResponse![0].GuidId}", data);
            
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
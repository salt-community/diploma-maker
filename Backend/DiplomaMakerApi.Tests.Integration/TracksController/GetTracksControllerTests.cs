using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DiplomaMakerApi.Dtos;
using FluentAssertions;
using Xunit;

namespace DiplomaMakerApi.Tests.Integration.TracksControllerTests
{
    public class GetTracksControllerTests : IClassFixture<DiplomaMakerApiFactory>
    {
        private readonly HttpClient _client;

        public GetTracksControllerTests(DiplomaMakerApiFactory apiFactory)
        {
            _client = apiFactory.CreateClient();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "mock-token");
        }

        [Fact ]
        public async void GetAll_ReturnsTracks_WhenTracksExist()
        {
            // Act
            var response = await _client.GetAsync("api/Tracks");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var trackResponse = await response.Content.ReadFromJsonAsync<List<TracksResponseDto>>();
            trackResponse.Should().Contain(x => x.Name == "C# Dotnet" && x.Tag == "dnfs");
            trackResponse.Should().Contain(x => x.Name == "Java" && x.Tag == "jfs");
            trackResponse.Should().Contain(x => x.Name == "Javascript" && x.Tag == "jsfs"); ;
        }

        [Fact]
        public async void GetAll_ReturnsUnathorized_WhenInvalidToken()
        {
            // Arrange
            _client.DefaultRequestHeaders.Authorization = null;

            // Act
            var response = await _client.GetAsync("api/Tracks");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}
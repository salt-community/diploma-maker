using System.Net;
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
        }

        [Fact]
        public async void GetAll_ReturnsUnathorized_WhenInvalidToken()
        {
            // Act
            var response = await _client.GetAsync("api/Tracks");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}